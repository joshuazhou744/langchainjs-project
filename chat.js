import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const chitchat = tool(
  async ({ prompt }) => {
    return (await llm.invoke([{ role: "user", content: prompt }])).choices[0].message.content;
  },
  {
    name: "chitchat",
    description: "General conversational fallback",
    schema: z.object({ prompt: z.string() }),
  }
);

export default chitchat;