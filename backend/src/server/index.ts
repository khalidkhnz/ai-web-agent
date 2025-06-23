import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AIAgent } from "../agent/index.js";
import { serverConfig, agentConfig } from "../config/index.js";
import type {
  ServerConfig,
  AgentConfig,
  UserMessage,
  AgentResponse,
  ErrorEvent,
} from "../types/index.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AgentServer {
  private app: express.Application;
  private httpServer: any;
  private io: Server;
  private agent: AIAgent;
  private config: ServerConfig;

  constructor(serverConfig: ServerConfig, agentConfig: AgentConfig) {
    this.config = serverConfig;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: serverConfig.corsOrigin,
        methods: ["GET", "POST"],
      },
    });

    this.agent = new AIAgent(agentConfig);
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  private setupMiddleware(): void {
    // CORS middleware
    this.app.use(
      cors({
        origin: this.config.corsOrigin,
      })
    );

    // JSON middleware
    this.app.use(express.json());

    // Static file serving
    this.app.use(express.static(this.config.staticPath));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req: Request, res: Response) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        agent: "ready",
        streaming: agentConfig.streaming,
      });
    });

    // API info endpoint
    this.app.get("/api/info", (req: Request, res: Response) => {
      res.json({
        name: "AI Agent WebSocket Server",
        version: "1.0.0",
        websocket: `ws://localhost:${this.config.port}`,
        capabilities: ["navigation", "notifications", "ui-actions"],
        features: {
          streaming: agentConfig.streaming,
          realTimeTools: true,
          webUI: true,
        },
      });
    });

    // REST API endpoint for non-streaming chat
    this.app.post("/api/chat", async (req: Request, res: Response) => {
      try {
        const { message } = req.body;
        if (!message) {
          res.status(400).json({ error: "Message is required" });
          return;
        }

        // Process without streaming for REST API
        const response = await this.agent.processMessage(message);

        res.json({
          response,
          timestamp: new Date().toISOString(),
          streaming: false,
        });
      } catch (error) {
        console.error("❌ REST API Error:", error);
        res.status(500).json({
          error: "Internal server error",
          message: "Sorry, i encountered an error processing your request.",
        });
      }
    });

    // Server-Sent Events endpoint for streaming chat
    this.app.post("/api/chat/stream", async (req: Request, res: Response) => {
      try {
        const { message } = req.body;
        if (!message) {
          res.status(400).json({ error: "Message is required" });
          return;
        }

        // Set up Server-Sent Events
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Cache-Control",
        });

        // Send initial event
        res.write(
          `data: ${JSON.stringify({
            type: "start",
            timestamp: new Date().toISOString(),
          })}\n\n`
        );

        // Process with streaming
        await this.agent.processMessageStream(message, (chunk: string) => {
          res.write(
            `data: ${JSON.stringify({
              type: "chunk",
              chunk,
              timestamp: new Date().toISOString(),
            })}\n\n`
          );
        });

        // Send end event
        res.write(
          `data: ${JSON.stringify({
            type: "end",
            timestamp: new Date().toISOString(),
          })}\n\n`
        );
        res.end();
      } catch (error) {
        console.error("❌ Streaming API Error:", error);
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: "Sorry, i encountered an error processing your request.",
          })}\n\n`
        );
        res.end();
      }
    });

    // Serve the main UI
    this.app.get("/", (req: Request, res: Response) => {
      res.sendFile(path.join(this.config.staticPath, "index.html"));
    });
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Frontend connected: ${socket.id}`);

      // Update agent with current socket
      this.agent.updateSocket(socket);

      // Handle user messages from frontend
      socket.on("userMessage", async (data: UserMessage) => {
        try {
          console.log(`📝 User message: ${data.message}`);

          if (agentConfig.streaming) {
            // Streaming is handled by the agent's callback system
            // The response will be streamed via streamStart, streamChunk, streamEnd events
            await this.agent.processMessage(data.message);
          } else {
            // Non-streaming response
            const response = await this.agent.processMessage(data.message);

            const agentResponse: AgentResponse = {
              action: "agentResponse",
              message: response,
              timestamp: new Date().toISOString(),
            };

            socket.emit("agentResponse", agentResponse);
            console.log(`💬 Agent response: ${response}`);
          }
        } catch (error) {
          console.error("❌ Error processing message:", error);

          const errorResponse: ErrorEvent = {
            action: "error",
            message: "Sorry, i encountered an error processing your request.",
            timestamp: new Date().toISOString(),
          };

          socket.emit("error", errorResponse);
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`🔌 Frontend disconnected: ${socket.id}`);
        // Note: In a multi-user scenario, you'd want to manage socket references per user
      });

      // Send welcome message
      const welcomeResponse: AgentResponse = {
        action: "agentResponse",
        message: `👋 Hello! I'm your intelligent assistant. I can help you navigate around the app, show you notifications, and assist with various tasks. Just tell me what you'd like to do in natural language - for example, "take me to the dashboard" or "show me a success message". How can I help you today?`,
        timestamp: new Date().toISOString(),
      };

      socket.emit("agentResponse", welcomeResponse);
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize the agent
      await this.agent.initialize();

      // Start the server
      this.httpServer.listen(this.config.port, () => {
        console.log(
          `🚀 Agent WebSocket server running on port ${this.config.port}`
        );
        console.log(
          `📡 Frontend can connect to: ws://localhost:${this.config.port}`
        );
        console.log(
          `🌐 Web UI available at: http://localhost:${this.config.port}`
        );
        console.log(`🔄 Streaming enabled: ${agentConfig.streaming}`);
        console.log(
          `📡 REST API: http://localhost:${this.config.port}/api/chat`
        );
        console.log(
          `🌊 Streaming API: http://localhost:${this.config.port}/api/chat/stream`
        );
        console.log(`🤖 Agent ready to receive instructions`);
      });
    } catch (error) {
      console.error("❌ Failed to start agent server:", error);
      throw error;
    }
  }
}

// Start the server
async function main() {
  try {
    const server = new AgentServer(serverConfig, agentConfig);
    await server.start();
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

main();
