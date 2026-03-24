"""
FastAPI main application — Solar Intelligence Assistant backend.

Endpoints:
  GET  /api/health    → Health check
  POST /api/chat      → Main chat endpoint with RAG
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from rag.intent_classifier import classify_intent
from rag.retriever import retrieve
from rag.gemini_client import generate_response

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Solar Intelligence Assistant API",
    description="RAG-based chatbot for Wattmonk — powered by Gemini + FAISS",
    version="1.0.0"
)

# Allow frontend (Vite dev server on :5173) to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Schemas ───────────────────────────────────────────────
class HistoryMessage(BaseModel):
    role: str       # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[HistoryMessage]] = []


class ChatResponse(BaseModel):
    answer: str
    source: str
    confidence: float
    intent: str
    retrieved_chunks: Optional[int] = 0


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "Solar Intelligence Assistant"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint.

    Flow:
    1. Classify user intent (NEC / Wattmonk / General)
    2. If NEC or Wattmonk → Retrieve top-3 chunks from FAISS
    3. Inject context + history → Gemini API
    4. Return answer, source, confidence
    """
    query = request.message.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Step 1 — Intent classification
    intent = classify_intent(query)

    # Step 2 — Retrieval (only for NEC and Wattmonk intents)
    context_chunks = []
    if intent in ("NEC", "WATTMONK"):
        source_key = "nec" if intent == "NEC" else "wattmonk"
        context_chunks = retrieve(query, source_key, top_k=3)

    # Step 3 — Build conversation history list
    history_dicts = [
        {"role": msg.role, "content": msg.content}
        for msg in (request.history or [])
    ]

    # Step 4 — Generate Gemini response
    result = generate_response(
        query=query,
        context_chunks=context_chunks,
        history=history_dicts,
        source_tag=intent
    )

    return ChatResponse(
        answer=result["answer"],
        source=result["source"],
        confidence=result["confidence"],
        intent=intent,
        retrieved_chunks=len(context_chunks)
    )


# ─── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
