import { ChatOllama } from "@langchain/ollama";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { v4 as uuidv4 } from "uuid";
import type {
  AgentConfig,
  ToolContext,
  StreamStartEvent,
  StreamChunkEvent,
  StreamEndEvent,
} from "../types/index.js";
import { createAllTools } from "../tools/index.js";

// Custom streaming callback handler
class StreamingCallbackHandler extends BaseCallbackHandler {
  name = "streaming_handler";
  private socket: any;
  private messageId: string;
  private fullMessage: string = "";

  constructor(socket: any, messageId: string) {
    super();
    this.socket = socket;
    this.messageId = messageId;
  }

  async handleLLMStart() {
    if (this.socket) {
      const streamStart: StreamStartEvent = {
        action: "streamStart",
        messageId: this.messageId,
        timestamp: new Date().toISOString(),
      };
      this.socket.emit("streamStart", streamStart);
    }
  }

  async handleLLMNewToken(token: string) {
    if (this.socket) {
      this.fullMessage += token;
      const streamChunk: StreamChunkEvent = {
        action: "streamChunk",
        messageId: this.messageId,
        chunk: token,
        timestamp: new Date().toISOString(),
      };
      this.socket.emit("streamChunk", streamChunk);
    }
  }

  async handleLLMEnd() {
    if (this.socket) {
      const streamEnd: StreamEndEvent = {
        action: "streamEnd",
        messageId: this.messageId,
        fullMessage: this.fullMessage,
        timestamp: new Date().toISOString(),
      };
      this.socket.emit("streamEnd", streamEnd);
    }
  }
}

export class AIAgent {
  private executor: AgentExecutor | null = null;
  private toolContext: ToolContext;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.toolContext = { socket: null };
  }

  public async initialize(): Promise<void> {
    this.executor = await this.createExecutor(this.config);
  }

  private async createExecutor(config: AgentConfig): Promise<AgentExecutor> {
    const model = new ChatOllama({
      baseUrl: config.ollamaBaseUrl,
      model: config.ollamaModel,
      streaming: config.streaming, // i am enabling streaming in the model
    });

    const tools = createAllTools(this.toolContext);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", this.getSystemPrompt()],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools,
      prompt,
    });

    return new AgentExecutor({
      agent,
      tools,
      verbose: config.verbose,
    });
  }

  private getSystemPrompt(): string {
    return `You are a helpful and intelligent assistant for a web application. You can help users navigate, show notifications, and control UI elements through natural conversation.

IMPORTANT INSTRUCTIONS:
- NEVER mention tool names, function calls, or technical implementation details to users
- NEVER ask users to type code or function calls like "navigateTo()" or "showNotification()"
- Understand natural language requests and use your tools automatically
- Respond conversationally and naturally
- When users ask to go somewhere, use the navigation tool immediately
- When users want to see messages or alerts, use the notification tool
- When users want to interact with UI elements, use the UI action tool

Available routes in the application:
- Home (/)
- Dashboard (/dashboard) 
- Users (/users)
- Clients (/clients)
- Analytics (/analytics)
- Calendar (/calendar)

You can understand requests like:
- "take me to the dashboard" → automatically use navigation tool
- "go to my profile" → automatically use navigation tool
- "show me a success message" → automatically use notification tool
- "open the modal" → automatically use UI action tool
- "refresh the data" → automatically use UI action tool

CONVERSATION STYLE:
- Be friendly, helpful, and conversational
- Acknowledge requests naturally: "Sure! Let me take you to the dashboard" 
- Use tools silently in the background - users don't need to know about them
- Provide helpful responses while performing actions
- If a user asks what you can do, explain capabilities in natural language without mentioning tools

Remember: Your job is to understand what users want in natural language and help them accomplish it seamlessly. Users should never need to know about the technical tools you're using.`;
  }

  public updateSocket(socket: any) {
    this.toolContext.socket = socket;
  }

  public async processMessage(message: string): Promise<string> {
    if (!this.executor) {
      throw new Error("Agent not initialized. Call initialize() first.");
    }

    try {
      let result;

      if (this.config.streaming && this.toolContext.socket) {
        // Generate unique message ID for this conversation
        const messageId = uuidv4();

        // Create streaming callback handler
        const streamingHandler = new StreamingCallbackHandler(
          this.toolContext.socket,
          messageId
        );

        // Execute with streaming callbacks
        result = await this.executor.call(
          { input: message },
          { callbacks: [streamingHandler] }
        );
      } else {
        // Non-streaming execution
        result = await this.executor.call({ input: message });
      }

      return result.output;
    } catch (error) {
      console.error("❌ Error processing message:", error);
      throw error;
    }
  }

  public async processMessageStream(
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    if (!this.executor) {
      throw new Error("Agent not initialized. Call initialize() first.");
    }

    try {
      let fullResponse = "";

      // Custom callback for direct streaming without WebSocket
      class DirectStreamingHandler extends BaseCallbackHandler {
        name = "direct_streaming_handler";

        async handleLLMNewToken(token: string) {
          fullResponse += token;
          onChunk(token);
        }
      }

      const streamingHandler = new DirectStreamingHandler();

      const result = await this.executor.call(
        { input: message },
        { callbacks: [streamingHandler] }
      );

      return result.output;
    } catch (error) {
      console.error("❌ Error processing streaming message:", error);
      throw error;
    }
  }
}
