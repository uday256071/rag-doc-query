# Building an End-to-End RAG Doc Query System with React, Node.js, OpenAI, and Qdrant

## Introduction

Retrieval-Augmented Generation (RAG) is revolutionizing how we interact with documents and knowledge bases. In this blog, I’ll walk you through building a complete RAG-powered document query system—from the React frontend to the Node.js backend, leveraging OpenAI for embeddings and Qdrant as the vector database. This project enables users to upload PDF documents and query their contents using a conversational AI interface.

## Project Overview

Our system consists of two main components:

- **Frontend:** A React app for uploading PDFs and chatting with the AI.
- **Backend:** A Node.js/Express server that processes PDFs, generates embeddings, stores them in Qdrant, and answers user queries.

## Frontend: React Application

The frontend provides a user-friendly interface for document upload and chat. Key features include:

- **PDF Upload:** Users can select and upload PDF files. The file is sent to the backend for processing.
- **Chat Interface:** Users can ask questions about the uploaded document. Both user and AI messages are displayed in a chat-like format.

### Code Highlights

The main logic resides in `App.js`:

- Handles file selection and upload via a form.
- Sends user queries to the backend and displays responses.
- Manages chat state and UI updates.

```jsx
// ...existing code...
const handleFileSubmit = async (e) => {
  e.preventDefault();
  // Upload logic
};

const handleQuerySubmit = async (e) => {
  e.preventDefault();
  // Query logic
};
// ...existing code...
```

### Running the Frontend

Install dependencies and start the app:

```sh
pnpm install
pnpm start
# or
npm install
npm start
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Backend: Node.js/Express API

The backend is responsible for processing PDFs, generating embeddings, storing them, and serving chat responses.

### PDF Upload & Embedding

1. **File Upload:** The backend receives the PDF via `/api/upload`.
2. **Text Extraction:** Uses `pdf-parse` to extract text from the PDF.
3. **Chunking:** Splits the text into manageable chunks to avoid exceeding model context limits.
4. **Embedding:** Each chunk is embedded using OpenAI’s embedding model.
5. **Storage:** Embeddings are stored in Qdrant, a high-performance vector database.

### Chat API

1. **Query Handling:** Receives user queries via `/api/chat`.
2. **Similarity Search:** Finds the most relevant document chunks using Qdrant.
3. **Prompt Construction:** Builds a prompt with the retrieved context and user query.
4. **AI Response:** Uses OpenAI’s GPT model to generate a response based on the context.

### Key Code Snippet

```js
// ...existing code...
const chunks = chunkText(data.text, 2000);
const documents = chunks.map((chunk, idx) => new Document({ pageContent: chunk, metadata: { chunk: idx + 1 } }));
const vectorStore = await QdrantVectorStore.fromDocuments(documents, embeddings, { ... });
// ...existing code...
```

### Running the Backend

Install dependencies and start the server:

```sh
pnpm install
pnpm start
# or
npm install
npm start
```

The server runs on [http://localhost:5000](http://localhost:5000).

### Running Qdrant

Start Qdrant using Docker Compose:

```sh
docker compose up -d
```

## How It All Works Together

1. **User uploads a PDF** via the frontend.
2. **Backend extracts and embeds the text, storing it in Qdrant.**
3. **User asks a question** in the chat interface.
4. **Backend retrieves relevant chunks** from Qdrant and sends them to OpenAI’s GPT model.
5. **AI responds** with an answer based on the document context.

## Technologies Used

- **React** for the frontend UI
- **Node.js/Express** for the backend API
- **OpenAI** for embeddings and chat completions
- **Qdrant** for vector storage and similarity search
- **pdf-parse** for PDF text extraction
- **Docker Compose** for running Qdrant

## Challenges & Solutions

- **Token Limit:** PDF text can easily exceed model context limits. We solved this by chunking the text before embedding.
- **Vector Search:** Qdrant enables fast and scalable similarity search for document chunks.
- **Seamless Integration:** The API endpoints are designed for easy communication between frontend and backend.

## Conclusion

This project demonstrates how to build a practical RAG system for document querying using modern AI and database technologies. The modular design allows for easy extension—such as supporting more file types, adding authentication, or scaling to larger document collections.

Feel free to fork, adapt, and build upon this foundation for your own AI-powered document applications!
