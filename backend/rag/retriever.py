"""
FAISS-based retriever.
Loads pre-built FAISS indices and retrieves relevant chunks for a query.
"""

import json
import os
import faiss
import numpy as np
from rag.embedder import embed_query

# Paths to FAISS indices and chunk metadata
# __file__ = .../backend/rag/retriever.py
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../backend
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)  # .../test_assignment
EMBEDDINGS_DIR = os.path.join(PROJECT_ROOT, "embeddings")

# Global index cache
_indices = {}
_chunks = {}


def load_index(source: str):
    """Load a FAISS index and its chunk metadata if not already loaded."""
    if source not in _indices:
        index_path = os.path.join(EMBEDDINGS_DIR, f"{source.lower()}.index")
        chunks_path = os.path.join(EMBEDDINGS_DIR, f"{source.lower()}_chunks.json")

        if not os.path.exists(index_path):
            raise FileNotFoundError(
                f"FAISS index not found at {index_path}. "
                "Please run: python rag/indexer.py"
            )

        _indices[source] = faiss.read_index(index_path)

        with open(chunks_path, "r", encoding="utf-8") as f:
            _chunks[source] = json.load(f)

    return _indices[source], _chunks[source]


def retrieve(query: str, source: str, top_k: int = 3) -> list[dict]:
    """
    Retrieve the top_k most relevant chunks for the given query.

    Args:
        query:  The user's question
        source: "wattmonk" or "nec"
        top_k:  Number of chunks to retrieve

    Returns:
        List of dicts: [{"text": ..., "source": ..., "score": ...}]
    """
    try:
        index, chunks = load_index(source)
        query_vec = embed_query(query)

        # FAISS similarity search (L2 distance → lower = more similar)
        distances, indices = index.search(query_vec, top_k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue  # FAISS returns -1 for empty slots
            results.append({
                "text": chunks[idx]["text"],
                "source": chunks[idx]["source"],
                "score": float(1 / (1 + dist)),  # Normalize to 0-1 (higher = better)
            })

        return results

    except FileNotFoundError as e:
        print(f"Warning: {e}")
        return []
    except Exception as e:
        print(f"Retrieval error: {e}")
        return []
