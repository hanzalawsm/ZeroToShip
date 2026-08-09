import os
import json
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

Respond ONLY with valid JSON in the format:
{"service": "...", "location": "...", "time": "...", "confidence": 0.9}
"""

REASONING_SYSTEM_PROMPT = """You are an AI assistant for a local service marketplace.
Your task is to analyze the user's request against the matched providers and generate a structured reasoning response.
Provide a short 1-2 sentence summary justifying why the top provider was chosen, and list 2-3 key factors (e.g., "Highest rating", "Fastest response time").

Respond ONLY with valid JSON matching this structure:
{"top_provider_id": 123, "summary": "...", "key_factors": ["...", "..."], "alternative_count": 0}
"""

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")


def extract_intent(prompt: str) -> ExtractedIntent:
    """Exclusively relies on Google Gemini API for intent extraction."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is missing. Configured Gemini API key is required.")

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
                return ExtractedIntent(**data, raw_prompt=prompt)
        except Exception as e:
            if attempt == 1:
                raise RuntimeError(f"Gemini LLM intent extraction failed: {e}")
            time.sleep(1)
            
    raise RuntimeError("Gemini LLM returned an empty response.")


def rank_providers(session: Session, intent: ExtractedIntent) -> Tuple[Optional[ProviderResponse], List[ProviderResponse]]:
    """Filters providers in DB based on extracted intent and ranks by rating, completion rate, and availability."""
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

    # Fallback to category or location filter if double match is empty
    if not matches and intent.service:
        fallback_stmt = select(Provider).where(col(Provider.category).ilike(intent.service)).order_by(
            col(Provider.rating).desc(),
            col(Provider.completion_rate).desc(),
            col(Provider.available_now).desc()
        )
        matches = session.exec(fallback_stmt).all()

    if not matches and intent.location:
        fallback_stmt = select(Provider).where(col(Provider.neighborhood_zone).ilike(intent.location)).order_by(
            col(Provider.rating).desc(),
            col(Provider.completion_rate).desc(),
            col(Provider.available_now).desc()
        )
        matches = session.exec(fallback_stmt).all()

    if not matches:
        fallback_stmt = select(Provider).order_by(
            col(Provider.rating).desc(),
            col(Provider.completion_rate).desc(),
            col(Provider.available_now).desc()
        )
        matches = session.exec(fallback_stmt).all()
        
    responses = [ProviderResponse.from_orm_provider(p) for p in matches]
    top_provider = responses[0] if responses else None
    return top_provider, responses


def generate_ai_reasoning(prompt: str, intent: ExtractedIntent, top_provider: Optional[ProviderResponse], matches_count: int) -> AIReasoning:
    """Generates structured reasoning using Gemini."""
    if not top_provider:
        return AIReasoning(
            top_provider_id=None,
            summary="No providers currently match the requested criteria in our database.",
            key_factors=[],
            alternative_count=0
        )

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is missing. Configured Gemini API key is required.")

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
                # Override alternative_count to be accurate
                data["alternative_count"] = max(0, matches_count - 1)
                data["top_provider_id"] = top_provider.provider_id
                return AIReasoning(**data)
        except Exception as e:
            if attempt == 1:
                raise RuntimeError(f"Gemini LLM reasoning generation failed: {e}")
            time.sleep(1)
            
    raise RuntimeError("Gemini LLM returned an empty response.")


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
