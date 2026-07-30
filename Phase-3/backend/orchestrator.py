import os
import json
from typing import Optional, List, Tuple
from sqlmodel import Session, select, col
from models import Provider, ExtractedIntent, OrchestrateResponse

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

Respond ONLY with valid JSON in the format:
{"service": "...", "location": "...", "time": "..."}
"""

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")


def extract_intent(prompt: str) -> ExtractedIntent:
    """Exclusively relies on Google Gemini API for intent extraction."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is missing. Configured Gemini API key is required.")

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
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
            return ExtractedIntent(**data)
        else:
            raise RuntimeError("Gemini LLM returned an empty response.")
    except Exception as e:
        raise RuntimeError(f"Gemini LLM intent extraction failed: {e}")


def rank_providers(session: Session, intent: ExtractedIntent) -> Tuple[Optional[Provider], List[Provider]]:
    """Filters providers in DB based on extracted intent and ranks by rating descending."""
    statement = select(Provider)

    filters = []
    if intent.service:
        filters.append(col(Provider.category).ilike(intent.service))
    if intent.location:
        filters.append(col(Provider.neighborhood_zone).ilike(intent.location))

    if filters:
        statement = statement.where(*filters)

    statement = statement.order_by(col(Provider.rating).desc())
    matches = session.exec(statement).all()

    # Fallback to category or location filter if double match is empty
    if not matches and intent.service:
        fallback_stmt = select(Provider).where(col(Provider.category).ilike(intent.service)).order_by(col(Provider.rating).desc())
        matches = session.exec(fallback_stmt).all()

    if not matches and intent.location:
        fallback_stmt = select(Provider).where(col(Provider.neighborhood_zone).ilike(intent.location)).order_by(col(Provider.rating).desc())
        matches = session.exec(fallback_stmt).all()

    if not matches:
        fallback_stmt = select(Provider).order_by(col(Provider.rating).desc())
        matches = session.exec(fallback_stmt).all()

    top_provider = matches[0] if matches else None
    return top_provider, matches


def generate_explanation(prompt: str, intent: ExtractedIntent, top_provider: Optional[Provider], matches_count: int) -> str:
    """Exclusively relies on Google Gemini API to generate textual explanation justifying top provider selection."""
    if not top_provider:
        return "No providers currently match the requested criteria in our database."

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is missing. Configured Gemini API key is required.")

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        explanation_prompt = (
            f"User Request: '{prompt}'\n"
            f"Extracted Intent: Service={intent.service}, Location={intent.location}, Time={intent.time}\n"
            f"Selected Provider: {top_provider.name} (Category: {top_provider.category}, Zone: {top_provider.neighborhood_zone}, Rating: {top_provider.rating}/5.0)\n"
            f"Total Matching Providers: {matches_count}\n\n"
            "Write a clear, concise 1-2 sentence explanation justifying why this provider was chosen as the best option."
        )
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=explanation_prompt,
        )
        if response.text:
            return response.text.strip()
        else:
            raise RuntimeError("Gemini LLM returned an empty response.")
    except Exception as e:
        raise RuntimeError(f"Gemini LLM explanation generation failed: {e}")


def orchestrate(prompt: str, session: Session) -> OrchestrateResponse:
    """Main orchestrator function executing AI intent extraction, DB ranking, and AI explanation generation."""
    intent = extract_intent(prompt)
    top_provider, matches = rank_providers(session, intent)
    explanation = generate_explanation(prompt, intent, top_provider, len(matches))

    return OrchestrateResponse(
        intent=intent,
        top_provider=top_provider,
        all_matches=matches,
        explanation=explanation
    )
