import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import {tool} from "@langchain/core/tools";
import {z} from "zod";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const jokePrompt = ChatPromptTemplate.fromTemplate("tell me a VERY FUNNY joke about {topic}");
const analysisPrompt = ChatPromptTemplate.fromTemplate(
  "is this a funny joke? {joke}"
);

const log = (label) => new RunnableLambda({
    func: async (input) => {
      console.log(label, input);
      return input;
    }
  });

const jokeChain = new RunnableLambda({
  func: async ({topic}) => {
    const joke = await jokePrompt
      .pipe(llm)
      .pipe(new StringOutputParser())
      .invoke({ topic });
    
    const analysis = await analysisPrompt
      .pipe(llm)
      .pipe(new StringOutputParser())
      .invoke({ joke });

    return {joke, analysis}
  }
})

const jokeTool = tool(
  async ({ topic }) => {
    const result = await jokeChain.invoke({ topic });
    return `Joke: ${result.joke}\nAnalysis: ${result.analysis}`;
  },
  {
    name: "joke",
    description: "Generate and analyze a joke about a given topic.",
    schema: z.object({
      topic: z.string().describe("The topic to joke about."),
    }),
  }
);

export default jokeTool;
