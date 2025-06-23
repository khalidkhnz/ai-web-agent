import type { ServerConfig, AgentConfig } from "../types/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || "3001"),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  staticPath: path.join(__dirname, "../../public"),
};

export const agentConfig: AgentConfig = {
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "mistral",
  verbose: process.env.VERBOSE === "true",
  streaming: process.env.STREAMING !== "false",
};
