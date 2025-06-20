import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import searchWeather from "./weather.js";
import chitchat from "./chat.js";
import joke from "./joke.js";

import dotenv from "dotenv";

dotenv.config();

const saver   = new MemorySaver();
const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const agent = createReactAgent({
  llm,
  tools: [searchWeather, chitchat, joke],
  prompt: "You are a helpful chatbot assistant that uses tools to answer questions. Only use the chat tool to steer conversation towards the other tools. If you don't know the answer, use the chitchat tool to keep the conversation going. Always try to steer the conversation towards the tools.",
  checkpointer: saver
});

export default agent;