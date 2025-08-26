# RAG Doc Query Frontend

This is the React-based frontend for the RAG Doc Query project. It allows users to upload PDF documents and interact with an AI-powered chat interface to query the contents of uploaded documents.

## Features

- Upload PDF files for processing
- Chat interface to ask questions about the uploaded document
- Displays both user and AI responses

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- pnpm (or npm/yarn)

### Installation

1. Navigate to the frontend directory:
   ```sh
   cd rag-doc-query-frontend
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```

### Running the App

Start the development server:

```sh
pnpm start
# or
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Upload a PDF using the left panel.
2. Once processed, use the chat box on the right to ask questions about the document.
3. The AI will respond based on the document's content.

## Project Structure

- `src/` - Main React source code
- `public/` - Static assets and HTML template

## API Endpoints

The frontend communicates with the backend via:

- `POST /api/upload` - Uploads PDF files
- `POST /api/chat` - Sends user queries and receives AI responses

## License

MIT
