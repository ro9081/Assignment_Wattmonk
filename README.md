# Solar Intelligence Assistant

A full-stack, retrieval-augmented generation (RAG) system engineered to answer complex questions regarding NEC electrical codes, system design principles, and Wattmonk service standards. 

## Overview

The application utilizes a local FAISS vector database to retrieve highly relevant context chunks, passing them into the Google Gemini language model. This context-injection grounds the AI responses in documented intelligence rather than generic model training data. 

**Knowledge Domains Indexed:**
- Wattmonk professional services (Plan sets, PTO, Zippy tool)
- National Electrical Code (NEC) articles specific to Photovoltaic setup
- General engineering practices and irradiance logic

## Architecture

| Component | Technology Stack |
| --- | --- |
| **Backend Framework** | FastAPI (Python) |
| **Generative AI Model** | Google Gemini (1.5 Flash) |
| **Embedding Model** | sentence-transformers/all-MiniLM-L6-v2 |
| **Vector Database** | FAISS |
| **Frontend Framework** | React 18, Vite |
| **User Interface** | Tailwind CSS (Glassmorphism design language) |

## Repository Structure

```
project_root/
|-- backend/
|   |-- main.py                (FastAPI execution)
|   |-- requirements.txt
|   |-- rag/
|       |-- embedder.py        (Generates local sentence embeddings)
|       |-- indexer.py         (Constructs local FAISS database)
|       |-- retriever.py       (Executes similarity search algorithms)
|       |-- gemini_client.py   (Controls context injection to generative AI)
|-- frontend/
|   |-- package.json
|   |-- src/
|       |-- components/        (React UI modules)
|       |-- api/chat.js        (Axios controller)
|-- data/                      (Source datasets)
|-- embeddings/                (Compiled FAISS structures)
|-- .env                       (Environment configuration)
|-- README.md
```

## Setup & Execution Instructions

### Prerequisites
- Node.js (v18.0+)
- Python (3.10+)
- Gemini API Key

### Configuration
1. Clone the repository to your local environment.
2. Ensure the `.env` file is present in the root directory and contains the following:
   `GEMINI_API_KEY=your_google_api_key_here`

### Backend Initialization
Launch the FastAPI server and prepare the vector indexing.
```bash
cd backend
pip install -r requirements.txt
python rag/indexer.py
python -m uvicorn main:app --reload --port 8000
```

### Frontend Initialization
Boot up the React frontend.
```bash
cd frontend
npm install
npm run dev
```

Navigate to the local development URI provided by Vite to interact with the system.

## Performance Mechanics
1. **Query Input:** A user inputs a sentence regarding solar parameters.
2. **Intent Routing:** The query is assessed and routed to the proper internal database section.
3. **Retrieval Algorithm:** L2 cosine distance is used in FAISS to return the top K related documentation chunks.
4. **Context Synthesis:** The semantic chunks are appended directly into the Gemini framework alongside strict systematic rules.
5. **Generative Output:** The model responds to the user while returning calculated confidence metrics for the generated response.
