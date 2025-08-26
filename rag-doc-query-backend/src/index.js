import express from "express";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import multer from "multer";
import dotenv from "dotenv";
import { OpenAIEmbeddings } from "@langchain/openai";
import cors from "cors";

const app = express();

// CORS configuration
app.use(cors()); // Use the corsOptions if you need specific settings

dotenv.config();

const upload = multer({ dest: "uploads/" });
const openai = new OpenAI();
app.use(express.json());

app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const loader = new PDFLoader(req.file.path);

    // Page by page load the PDF file
    const docs = await loader.load();

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
      docs,
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "rag-collection",
      }
    );

    res.send("PDF processed and embeddings pushed to Qdrant.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing PDF.");
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).send("No query provided.");
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "rag-collection",
      }
    );

    const searchResult = await vectorStore.similaritySearch(query, 5);

    const context = searchResult
      .map((result) => result.pageContent)
      .join("\n\n");

    const prompt = `You are an expert AI assistant helping users answer questions about a PDF document. Use ONLY the provided context below to answer the user's query.

Instructions:
- If you find the answer in the context, provide a clear and concise answer first. Then, in a new line at the BOTTOM of your response, write "Page(s):" followed by the relevant page numbers (if available).
- If multiple pages are relevant, list all page numbers separated by commas.
- If you do NOT find the answer in the context, reply ONLY with: "I don't have the context to answer that question."
- Do NOT use any information outside the context.

Context:
${context}

User Query:
${query}

Remember: Always mention the page number(s) at the bottom of your answer in a new line if available.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });
    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing query.");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
