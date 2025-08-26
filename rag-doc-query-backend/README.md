# RAG Doc Query Backend

This is the backend service for the RAG Doc Query project. It processes PDF uploads, generates embeddings, stores them in Qdrant, and provides an API for querying document content using AI.

## Features

- Accepts PDF uploads and extracts text
- Splits text into manageable chunks for embedding
- Generates embeddings using OpenAI
- Stores embeddings in Qdrant vector database
- Provides chat API for querying document content

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- pnpm (or npm/yarn)
- Docker (for Qdrant)

### Installation

1. Navigate to the backend directory:
   ```sh
   cd rag-doc-query-backend
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following:

```
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
PORT=5000
```

### Running Qdrant (Vector DB)

Start Qdrant using Docker Compose:

```sh
docker compose up -d
```

### Running the Backend Server

Start the backend server:

```sh
pnpm start
# or
npm start
```

The server will run on [http://localhost:5000](http://localhost:5000).

## API Endpoints

- `POST /api/upload` — Upload a PDF file for processing and embedding
- `POST /api/chat` — Query the document content via chat interface

## Project Structure

- `src/` — Main backend source code
- `uploads/` — Temporary storage for uploaded files
- `docker-compose.yaml` — Qdrant service configuration

## License

MIT
