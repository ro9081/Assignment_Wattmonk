"""
Gemini API client — wraps google-generativeai for chat completions.
Uses gemini-2.0-flash for fast, cost-efficient responses.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Explicitly load .env from project root (two levels up from backend/rag/)
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/rag/
_PROJECT_ROOT = os.path.dirname(os.path.dirname(_THIS_DIR))  # test_assignment/
load_dotenv(os.path.join(_PROJECT_ROOT, ".env"))

# Configure Gemini with API key from environment
_API_KEY = os.getenv("GEMINI_API_KEY", "")
if _API_KEY:
    genai.configure(api_key=_API_KEY)

# System prompt — the assistant's personality and grounding rules
SYSTEM_PROMPT = """You are Solar Sage, a knowledgeable solar energy assistant for Wattmonk.

Answer questions about Wattmonk services, NEC electrical code, and solar energy.

Strict formatting rules:
- Write in plain, clear sentences. No markdown, no bold (**text**), no asterisks, no headers.
- Do not use bullet points or numbered lists unless the user explicitly asks for a list.
- Keep answers concise — 3 to 5 sentences for most questions. Only go longer if the topic genuinely requires it.
- Sound like a knowledgeable colleague, not a report generator. Avoid phrases like "Certainly!", "Great question!", "Based on the provided context".
- When you use information from the knowledge base, briefly mention the source naturally in the sentence (e.g. "According to Wattmonk's documentation..." or "NEC Article 690 states...").
- If you do not know the answer, say so plainly and suggest consulting a licensed professional.
"""


def generate_response(
    query: str,
    context_chunks: list[dict],
    history: list[dict],
    source_tag: str
) -> dict:
    """
    Generate a response using Gemini with RAG context injection.

    Args:
        query:          The user's current question
        context_chunks: Retrieved chunks from FAISS [{text, source, score}]
        history:        Last N conversation turns [{role, content}]
        source_tag:     "NEC", "WATTMONK", or "GENERAL"

    Returns:
        dict: {"answer": str, "source": str, "confidence": float}
    """
    if not _API_KEY:
        return {
            "answer": "⚠️ Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.",
            "source": "ERROR",
            "confidence": 0.0
        }

    # Build context string from retrieved chunks
    context_str = ""
    avg_score = 0.0

    if context_chunks:
        context_parts = []
        for i, chunk in enumerate(context_chunks, 1):
            context_parts.append(f"[Chunk {i} from {chunk['source']}]:\n{chunk['text']}")
            avg_score += chunk.get("score", 0.5)
        context_str = "\n\n".join(context_parts)
        avg_score = avg_score / len(context_chunks)
    else:
        avg_score = 0.5  # General response confidence

    # Build the prompt with context injection
    if context_str:
        prompt = f"""CONTEXT FROM KNOWLEDGE BASE:
{context_str}

USER QUESTION: {query}

Based on the context above, provide a clear and helpful answer. Mention the source of your information."""
    else:
        prompt = f"""USER QUESTION: {query}

Answer this general solar energy question based on your knowledge."""

    # Build Gemini conversation history
    # Prepend system instructions to the first user message
    gemini_history = []
    for turn in history[-4:]:  # Keep last 4 turns (2 exchanges) for context window
        role = "user" if turn["role"] == "user" else "model"
        gemini_history.append({
            "role": role,
            "parts": [{"text": turn["content"]}]
        })

    try:
        model = genai.GenerativeModel(model_name="gemini-2.5-flash")

        # Prepend system prompt to the user message for compatibility
        full_prompt = f"{SYSTEM_PROMPT}\n\n{prompt}"

        # Use chat session for conversation memory
        chat = model.start_chat(history=gemini_history)
        response = chat.send_message(full_prompt)

        answer_text = response.text.strip()

        # Map source tag to display label
        source_display = {
            "NEC": "NEC Code",
            "WATTMONK": "Wattmonk",
            "GENERAL": "General Knowledge"
        }.get(source_tag, "General Knowledge")

        # Clamp confidence to reasonable range
        confidence = round(min(max(avg_score, 0.1), 0.99), 2)

        return {
            "answer": answer_text,
            "source": source_display,
            "confidence": confidence
        }

    except Exception as e:
        error_msg = str(e)
        if "API_KEY" in error_msg.upper() or "INVALID" in error_msg.upper():
            return {
                "answer": "⚠️ Invalid Gemini API key. Please check your GEMINI_API_KEY in the .env file.",
                "source": "ERROR",
                "confidence": 0.0
            }
        return {
            "answer": f"I encountered an error while generating a response. Please try again. (Error: {error_msg[:100]})",
            "source": "ERROR",
            "confidence": 0.0
        }
