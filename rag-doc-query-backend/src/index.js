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
        collectionName: "chaicode-collection",
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
        collectionName: "chaicode-collection",
      }
    );

    const searchResult = await vectorStore.similaritySearch(query, 5);

    const context = searchResult
      .map((result) => result.pageContent)
      .join("\n\n");

    const prompt = `You are a helpful AI assistant who helps resolving user query based on the context and content available to you from the PDF file. Always mention Page number in the response on TOP of the answer then answer the question from next line.
    Only answer the question if you have the answer in the context provided . If you don't have the answer, just say "I don't have the context to answer that question".
            Context: \n${context}
            Query: \n {query}`;

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
