"""
FAISS Index Builder — chunks text files and builds vector indices.
Run this script ONCE (or whenever data changes) to generate the FAISS indices.

Usage: python rag/indexer.py
"""

import json
import os
import sys
import faiss
import numpy as np

# Add parent dir to path so we can import embedder
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from rag.embedder import embed_texts

# ─── Paths ────────────────────────────────────────────────────────────────────
# __file__ = .../backend/rag/indexer.py
# dirname x3 → project root (test_assignment/)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../backend
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)  # .../test_assignment
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
EMBEDDINGS_DIR = os.path.join(PROJECT_ROOT, "embeddings")
os.makedirs(EMBEDDINGS_DIR, exist_ok=True)


# ─── Text Chunker ──────────────────────────────────────────────────────────────
def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks of ~chunk_size words.
    Overlap ensures context is not lost at chunk boundaries.
    """
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk.strip())
        if end == len(words):
            break
        start += chunk_size - overlap  # Slide with overlap

    return [c for c in chunks if len(c.split()) >= 10]  # Skip tiny chunks


# ─── Index Builder ─────────────────────────────────────────────────────────────
def build_index(source_name: str):
    """
    Builds and saves a FAISS index + chunk metadata for a given data source.

    Args:
        source_name: "wattmonk" or "nec"
    """
    data_file = os.path.join(DATA_DIR, f"{source_name}_info.txt")

    if not os.path.exists(data_file):
        print(f"[ERROR] Data file not found: {data_file}")
        return

    print(f"\n[INFO] Processing {source_name.upper()} data...")

    # Load and chunk
    with open(data_file, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text, chunk_size=300, overlap=50)
    print(f"[INFO] Created {len(chunks)} chunks from {source_name}_info.txt")

    # Build metadata
    chunk_metadata = [
        {"text": chunk, "source": source_name.upper()}
        for chunk in chunks
    ]

    # Generate embeddings
    print(f"[INFO] Generating embeddings for {len(chunks)} chunks...")
    embeddings = embed_texts(chunks)  # shape: (n_chunks, 384)

    # Build FAISS index (IndexFlatL2 = brute-force exact search, great for small datasets)
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    # Save index and metadata
    index_path = os.path.join(EMBEDDINGS_DIR, f"{source_name}.index")
    chunks_path = os.path.join(EMBEDDINGS_DIR, f"{source_name}_chunks.json")

    faiss.write_index(index, index_path)
    with open(chunks_path, "w", encoding="utf-8") as f:
        json.dump(chunk_metadata, f, indent=2, ensure_ascii=False)

    print(f"[OK] Saved FAISS index → {index_path}")
    print(f"[OK] Saved chunk metadata → {chunks_path}")


# ─── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("  Solar Intelligence Assistant — FAISS Index Builder")
    print("=" * 60)

    build_index("wattmonk")
    build_index("nec")

    print("\n[DONE] All indices built successfully!")
    print(f"       Indices saved to: {EMBEDDINGS_DIR}")
