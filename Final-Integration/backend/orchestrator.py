import os
import json
import re
import time
from dotenv import load_dotenv
load_dotenv()
from typing import Optional, List, Tuple
from sqlmodel import Session, select, col
from models import Provider, ExtractedIntent, OrchestrateResponse, ProviderResponse, AIReasoning

# System prompt for structured intent extraction
INTENT_SYSTEM_PROMPT = """You are an AI assistant for a local service marketplace in Karachi, Pakistan.
Your job is to extract user intent from natural language prompts.
Inputs may be in English, Urdu, or Roman Urdu (e.g. "Mujhe Gulshan me electrician chahiye", "Need a plumber in Johar tomorrow", "پلمبر جوہر").

Extract the following fields strictly:
1. "service": Must be one of the following exact categories if mentioned or implied (otherwise null):
   ["plumber", "electrician", "carpenter", "painter", "cleaner"]
   Map Urdu/Roman Urdu terms like:
   - "bijli wala", "electrician", "bijli", "elec" -> "electrician"
   - "nal wala", "plumber", "pipe", "plumb" -> "plumber"
   - "karkhana", "carpenter", "lakri wala" -> "carpenter"
   - "painter", "rang wala", "paint" -> "painter"
   - "safai", "cleaner", "cleaning" -> "cleaner"

2. "location": Must be one of the following exact neighborhood zones if mentioned (otherwise null):
   ["Gulshan", "Johar", "Clifton", "DHA", "Nazimabad", "North Nazimabad", "PECHS", "Malir"]
   Recognize Roman Urdu and variations (e.g. "gulshan e iqbal" -> "Gulshan", "johar" -> "Johar", "dha" -> "DHA", "pechs" -> "PECHS").

3. "time": Extracted time, date, or urgency string (e.g. "Tomorrow at 3 PM", "Urgent", "kal subah") or null if not specified.

4. "confidence": A float from 0.0 to 1.0 indicating how confident you are in the extracted intent.

5. "is_service_request": A boolean (true or false). Set to TRUE ONLY IF the prompt expresses an intent to find, hire, search for, or inquire about local service providers or service categories. Set to FALSE for general greetings ("hi", "hello", "hey"), casual conversation ("how are you?"), general knowledge/math ("what is 2+2"), or queries completely unrelated to local home services.

Respond ONLY with valid JSON in the format:
{"service": "...", "location": "...", "time": "...", "confidence": 0.9, "is_service_request": true}
"""

REASONING_SYSTEM_PROMPT = """You are an AI assistant for a local service marketplace in Karachi, Pakistan.
Analyze the user's request and matched providers.
If the prompt is a general conversational request (not looking for services), respond with a friendly message introducing our available services (plumber, electrician, carpenter, painter, cleaner) and key_factors = [].
If providers were matched, provide a 1-2 sentence summary justifying why the top provider was chosen, and list 2-3 key factors (e.g., "Highest rating", "Fastest response time").

Respond ONLY with valid JSON matching this structure:
{"top_provider_id": 123, "summary": "...", "key_factors": ["...", "..."], "alternative_count": 0}
"""

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")


def _rule_based_intent_fallback(prompt: str) -> ExtractedIntent:
    """Fallback rule-based intent extractor when Gemini API is unconfigured or unreachable."""
    prompt_lower = prompt.lower()
    
    # Categories
    service = None
    if re.search(r'\b(electrician|bijli|electric|power)\b', prompt_lower):
        service = "electrician"
    elif re.search(r'\b(plumber|nal|pipe|leak|plumb|water)\b', prompt_lower):
        service = "plumber"
    elif re.search(r'\b(carpenter|lakri|furniture|wood)\b', prompt_lower):
        service = "carpenter"
    elif re.search(r'\b(painter|rang|paint|wall)\b', prompt_lower):
        service = "painter"
    elif re.search(r'\b(cleaner|safai|cleaning|clean)\b', prompt_lower):
        service = "cleaner"

    # Locations
    location = None
    if re.search(r'\b(gulshan|iqbal)\b', prompt_lower):
        location = "Gulshan"
    elif re.search(r'\b(johar)\b', prompt_lower):
        location = "Johar"
    elif re.search(r'\b(clifton)\b', prompt_lower):
        location = "Clifton"
    elif re.search(r'\b(dha|defence)\b', prompt_lower):
        location = "DHA"
    elif re.search(r'\b(north nazimabad)\b', prompt_lower):
        location = "North Nazimabad"
    elif re.search(r'\b(nazimabad)\b', prompt_lower):
        location = "Nazimabad"
    elif re.search(r'\b(pechs)\b', prompt_lower):
        location = "PECHS"
    elif re.search(r'\b(malir)\b', prompt_lower):
        location = "Malir"

    # Time/Urgency
    time_str = None
    if "urgent" in prompt_lower or "asap" in prompt_lower or "abhibhi" in prompt_lower:
        time_str = "Urgent"
    elif "tomorrow" in prompt_lower or "kal" in prompt_lower:
        time_str = "Tomorrow"
    elif "today" in prompt_lower or "aaj" in prompt_lower:
        time_str = "Today"

    # Determine if service request
    is_service_request = service is not None or location is not None
    # Common non-service triggers override
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "how are you", "what can you do", "help", "who are you"]
    if prompt_lower.strip() in greetings or prompt_lower.startswith(("what is", "who is", "tell me")):
        if service is None:
            is_service_request = False

    return ExtractedIntent(
        service=service,
        location=location,
        time=time_str,
        confidence=0.85 if is_service_request else 0.0,
        is_service_request=is_service_request,
        raw_prompt=prompt
    )


def extract_intent(prompt: str) -> ExtractedIntent:
    """Relies on Google Gemini API for intent extraction, with a rule-based fallback."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _rule_based_intent_fallback(prompt)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=GEMINI_MODEL,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=INTENT_SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        response_schema=ExtractedIntent,
                        temperature=0.1,
                    ),
                )
                if response.text:
                    data = json.loads(response.text)
                    intent = ExtractedIntent(**data, raw_prompt=prompt)
                    # Double-check non-service consistency
                    if not intent.service and not intent.location:
                        intent.is_service_request = False
                    return intent
            except Exception:
                if attempt == 1:
                    break
                time.sleep(0.5)
    except Exception:
        pass
        
    return _rule_based_intent_fallback(prompt)


def rank_providers(session: Session, intent: ExtractedIntent) -> Tuple[Optional[ProviderResponse], List[ProviderResponse]]:
    """Filters providers in DB based on extracted intent. Does NOT match providers for non-service requests."""
    # If the user has no intent to find a service, return no matches
    if not intent.is_service_request or (not intent.service and not intent.location):
        return None, []

    statement = select(Provider)

    filters = []
    if intent.service:
        filters.append(col(Provider.category).ilike(intent.service))
    if intent.location:
        filters.append(col(Provider.neighborhood_zone).ilike(intent.location))

    if filters:
        statement = statement.where(*filters)

    statement = statement.order_by(
        col(Provider.rating).desc(),
        col(Provider.completion_rate).desc(),
        col(Provider.available_now).desc()
    )
    matches = session.exec(statement).all()

    # Fallback to category filter if double match (service + location) yielded no results
    if not matches and intent.service:
        fallback_stmt = select(Provider).where(col(Provider.category).ilike(intent.service)).order_by(
            col(Provider.rating).desc(),
            col(Provider.completion_rate).desc(),
            col(Provider.available_now).desc()
        )
        matches = session.exec(fallback_stmt).all()

    # Fallback to location filter if service wasn't matched but location was specified
    if not matches and intent.location:
        fallback_stmt = select(Provider).where(col(Provider.neighborhood_zone).ilike(intent.location)).order_by(
            col(Provider.rating).desc(),
            col(Provider.completion_rate).desc(),
            col(Provider.available_now).desc()
        )
        matches = session.exec(fallback_stmt).all()

    responses = [ProviderResponse.from_orm_provider(p) for p in matches]
    top_provider = responses[0] if responses else None
    return top_provider, responses


def generate_ai_reasoning(prompt: str, intent: ExtractedIntent, top_provider: Optional[ProviderResponse], matches_count: int) -> AIReasoning:
    """Generates structured reasoning using Gemini or a graceful conversational response for non-service prompts."""
    # Handle non-service prompts gracefully
    if not intent.is_service_request:
        prompt_lower = prompt.lower().strip()
        if any(g in prompt_lower for g in ["hi", "hello", "hey", "aao", "salam"]):
            summary = "Hello! I am your AI assistant for local service professionals in Karachi. I can help you find top-rated electricians, plumbers, carpenters, painters, and cleaners in your neighborhood. How can I help you today?"
        else:
            summary = f"I couldn't detect a home service request in your message ('{prompt}'). We currently connect you with verified Electricians, Plumbers, Carpenters, Painters, and Cleaners in Karachi. Please tell me which service you need and your area."

        return AIReasoning(
            top_provider_id=None,
            summary=summary,
            key_factors=[],
            alternative_count=0
        )

    # Handle service requests with no matching providers in DB
    if not top_provider:
        svc_str = intent.service if intent.service else "requested service"
        loc_str = f" in {intent.location}" if intent.location else ""
        return AIReasoning(
            top_provider_id=None,
            summary=f"No verified {svc_str} providers{loc_str} are currently available in our database. We offer professionals for plumbing, electrical work, carpentry, painting, and cleaning across Karachi.",
            key_factors=[],
            alternative_count=0
        )

    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=api_key)
            
            explanation_prompt = (
                f"User Request: '{prompt}'\n"
                f"Extracted Intent: Service={intent.service}, Location={intent.location}, Time={intent.time}\n"
                f"Selected Provider: {top_provider.name} (Category: {top_provider.category}, Zone: {top_provider.neighborhood_zone}, Rating: {top_provider.rating}/5.0)\n"
                f"Total Matching Providers: {matches_count}\n"
            )
            
            for attempt in range(2):
                try:
                    response = client.models.generate_content(
                        model=GEMINI_MODEL,
                        contents=explanation_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=REASONING_SYSTEM_PROMPT,
                            response_mime_type="application/json",
                            response_schema=AIReasoning,
                            temperature=0.2,
                        ),
                    )
                    if response.text:
                        data = json.loads(response.text)
                        data["alternative_count"] = max(0, matches_count - 1)
                        data["top_provider_id"] = top_provider.provider_id
                        return AIReasoning(**data)
                except Exception:
                    if attempt == 1:
                        break
                    time.sleep(0.5)
        except Exception:
            pass

    # Fallback AI reasoning if Gemini is unavailable
    factors = [f"Rating: {top_provider.rating}/5.0", f"Location: {top_provider.neighborhood_zone}"]
    if top_provider.response_time:
        factors.append(f"Response time: {top_provider.response_time}")

    return AIReasoning(
        top_provider_id=top_provider.provider_id,
        summary=f"{top_provider.name} is selected as the top-rated {top_provider.category} available in {top_provider.neighborhood_zone}.",
        key_factors=factors,
        alternative_count=max(0, matches_count - 1)
    )


def orchestrate(prompt: str, session: Session) -> OrchestrateResponse:
    """Main orchestrator function executing AI intent extraction, DB ranking, and AI reasoning generation."""
    intent = extract_intent(prompt)
    top_provider, matches = rank_providers(session, intent)
    reasoning = generate_ai_reasoning(prompt, intent, top_provider, len(matches))

    return OrchestrateResponse(
        intent=intent,
        top_provider=top_provider,
        all_matches=matches,
        aiReasoning=reasoning
    )

