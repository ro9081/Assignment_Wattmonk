"""
Embedder — uses Google Gemini Embedding API (text-embedding-004).
No PyTorch or sentence-transformers required, making this deployment-friendly.
"""

import os
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env from project root
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(os.path.dirname(_THIS_DIR))
load_dotenv(os.path.join(_PROJECT_ROOT, ".env"))

_API_KEY = os.getenv("GEMINI_API_KEY", "")
if _API_KEY:
    genai.configure(api_key=_API_KEY)

EMBEDDING_MODEL = "models/text-embedding-004"
EMBEDDING_DIM = 768  # text-embedding-004 outputs 768-dim vectors


def embed_texts(texts: list[str]) -> np.ndarray:
    """
    Embed a list of texts using Gemini text-embedding-004.
    Returns a float32 numpy array of shape (n, 768).
    """
    embeddings = []
    for text in texts:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document"
        )
        embeddings.append(result["embedding"])
    return np.array(embeddings, dtype=np.float32)


def embed_query(text: str) -> np.ndarray:
    """
    Embed a single query string.
    Returns a float32 numpy array of shape (1, 768).
    """
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_query"
    )
    return np.array([result["embedding"]], dtype=np.float32)
