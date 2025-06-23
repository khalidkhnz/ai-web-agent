import { Socket } from "socket.io";

// WebSocket event types
export interface UserMessage {
  message: string;
}

export interface AgentResponse {
  action: "agentResponse";
  message: string;
  timestamp: string;
}

// Streaming response types
export interface StreamStartEvent {
  action: "streamStart";
  messageId: string;
  timestamp: string;
}

export interface StreamChunkEvent {
  action: "streamChunk";
  messageId: string;
  chunk: string;
  timestamp: string;
}

export interface StreamEndEvent {
  action: "streamEnd";
  messageId: string;
  fullMessage: string;
  timestamp: string;
}

export interface NavigationEvent {
  action: "navigate";
  path: string;
  page: string;
  timestamp: string;
}

export interface NotificationEvent {
  action: "notification";
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration: number;
  timestamp: string;
}

export interface UIActionEvent {
  action: "uiAction";
  uiAction:
    | "openModal"
    | "closeModal"
    | "refreshData"
    | "updateTheme"
    | "toggleSidebar";
  payload?: any;
  timestamp: string;
}

export interface ErrorEvent {
  action: "error";
  message: string;
  timestamp: string;
}

// Tool types
export interface ToolContext {
  socket: Socket | null;
}

export interface RouteMap {
  [key: string]: string;
}

// Agent configuration
export interface AgentConfig {
  ollamaBaseUrl: string;
  ollamaModel: string;
  verbose: boolean;
  streaming: boolean;
}

// Server configuration
export interface ServerConfig {
  port: number;
  corsOrigin: string;
  staticPath: string;
}
