import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import agent from "./agent.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const THREAD_ID = "main-chat";
const CONFIG    = { configurable: { thread_id: THREAD_ID } };

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message." });

  try {
    const response = await agent.invoke(
      { messages: [{ role: "user", content: message }] },
      CONFIG
    );

    const assistantMsg = response.messages.at(-1);

    res.json({
      reply: assistantMsg?.content ?? "No response generated.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
