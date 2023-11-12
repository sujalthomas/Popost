// Existing imports from the initial script
import { AgentExecutor } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { AIMessage, AgentStep, BaseMessage, FunctionMessage } from "langchain/schema";
import { RunnableSequence } from "langchain/schema/runnable";
import { SerpAPI, formatToOpenAIFunction } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { BufferMemory } from "langchain/memory";

// New imports for web browsing and searching functionality
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { WebBrowser } from "langchain/tools/webbrowser";
import Post from "@models/post";
import { connectToDB } from "@utils/database";

// Existing setups
const memory = new BufferMemory({
  memoryKey: "history",
  inputKey: "question",
  outputKey: "answer",
  returnMessages: true,
});

const toolsOriginal = [new Calculator(), new SerpAPI()];

const modelOriginal = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

const promptOriginal = ChatPromptTemplate.fromMessages([
  ["ai", "You are a helpful assistant"],
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
  new MessagesPlaceholder("chat_history"),
]);

const modelWithToolsOriginal = modelOriginal.bind({
  functions: [...toolsOriginal.map((tool) => formatToOpenAIFunction(tool))],
});

const formatAgentSteps = (steps) =>
  steps.flatMap(({ action, observation }) => {
    if ("messageLog" in action && action.messageLog !== undefined) {
      const log = action.messageLog;
      return log.concat(new FunctionMessage(observation, action.tool));
    } else {
      return [new AIMessage(action.log)];
    }
  });

const runnableAgentOriginal = RunnableSequence.from([
  {
    input: (i) => i.input,
    agent_scratchpad: (i) => formatAgentSteps(i.steps),
    chat_history: async (_) => {
      const { history } = await memory.loadMemoryVariables({});
      return history;
    },
  },
  promptOriginal,
  modelWithToolsOriginal,
  new OpenAIFunctionsAgentOutputParser(),
]);

const executorOriginal = AgentExecutor.fromAgentAndTools({
  agent: runnableAgentOriginal,
  tools: toolsOriginal,
});

// New setups for web browsing and searching functionality
const modelNew = new OpenAI({ temperature: 0 });
const embeddings = new OpenAIEmbeddings();
const toolsNew = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Austin,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
  new WebBrowser({ model: modelNew, embeddings }),
];

let executorNew;

// Initialize the new executor with web browsing and searching functionality
async function initializeExecutorNew() {
    if (!executorNew) {
      executorNew = await initializeAgentExecutorWithOptions(toolsNew, modelNew, {
        agentType: "zero-shot-react-description",
        verbose: true,
      });
    }
  }
  
  // Function to perform research and generate a social media post
  async function performResearchAndGeneratePost(topic, resources) {
    await initializeExecutorNew(); // Ensure the executor is ready
  
    // Logging that the agents are loaded
    console.log("Loaded agents.");
  
    // Variable to store all the summaries
    let summaries = [];
  
    // Visit each URL and summarize the content
    for (const url of resources) {
      console.log(`Visiting URL: ${url}`);
      const browsingResult = await executorNew.call({ input: url });
      summaries.push(`Summary from ${url}: ${browsingResult.output}`);
      console.log(summaries[summaries.length - 1]);
    }
  
    // Perform a mandatory Google search
    console.log(`Performing a Google search for: ${topic}`);
    const searchQuery = `Find information on ${topic}`;
    const searchResult = await executorNew.call({ input: searchQuery });
    console.log(`Google search results for ${topic}: ${searchResult.output}`);
  
    // Create a social media post prompt including the topic and gathered information
    const socialMediaPostPrompt = `Create a captivating social media post that is semi-professional and engaging for the following topic: "${topic}". The post should be concise, appeal to a broad audience, and encourage interaction. Include a catchy opening, valuable insights, and a call-to-action. Include relevant links: ${resources.join(", ")}.`;
  
    // Generate the social media post
    console.log(`Generating social media post for the topic: ${topic}`);
    const postResult = await executorOriginal.call({
      input: socialMediaPostPrompt,
    });
    //console.log(`Generated social media post: ${postResult.output}`);
  
    // Return the final post along with the summaries
    return {
      post: postResult.output,
      summaries: summaries,
    };
  }

  // API endpoint handler for GET request
  export const GET = async (request) => {
    try {
        await connectToDB()

        const content = await Post.find({}).populate('creator')

        return new Response(JSON.stringify(content), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all posts", { status: 500 })
    }
} 
  
  // API endpoint handler for POST request
  export const POST = async (request) => {
    try {
      const { topic, resources } = await request.json();
  
      if (!topic || !resources) {
        throw new Error("Missing topic or resources in the request payload.");
      }
  
      const { post, summaries } = await performResearchAndGeneratePost(topic, resources);
  
      // Output the result to the terminal and console logs
      //console.log("Final social media post:", post);
      summaries.forEach(summary => console.log(summary));
  
      return new Response(JSON.stringify({ post, summaries }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("Error creating new post:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
  