# 🤖 AI Agent with WebSocket Communication

A production-ready, modular AI agent that uses WebSocket communication to control frontend applications in real-time. Built with LangChain, Ollama, Socket.IO, and Express.

## 🏗️ Architecture

### Modular Structure

```
src/
├── agent/          # AI agent logic and LangChain integration
├── config/         # Configuration management
├── server/         # Express server and Socket.IO setup
├── tools/          # Individual agent tools (navigation, notifications, etc.)
├── types/          # TypeScript type definitions
public/             # Static files served by Express
├── index.html      # Web UI for testing the agent
```

### Key Features

- **🔄 Real-time Communication**: Socket.IO WebSocket for instant frontend-backend communication
- **🧩 Modular Architecture**: Easy to extend with new tools and capabilities
- **🌐 Web Server**: Express.js serves static files and provides REST endpoints
- **🛠️ Multiple Agent Capabilities**:
  - 🔀 **Navigation**: Navigate users to different pages
  - 🔔 **Notifications**: Show real-time notifications to users
  - 🎛️ **UI Actions**: Control UI elements (modals, data refresh, theme changes, etc.)
- **📦 Production Ready**: Proper error handling, TypeScript support, and scalable design
- **🔧 Extensible**: Simple API for adding new tools and capabilities

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment

Create a `.env` file:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
PORT=3001
CORS_ORIGIN=*
VERBOSE=false
```

### 3. Start Ollama

Make sure Ollama is running with your preferred model:

```bash
ollama serve
ollama pull mistral  # or your preferred model
```

### 4. Start the Agent Server

```bash
bun run dev
```

The server will start on `http://localhost:3001` with:

- 🌐 Web UI at: `http://localhost:3001`
- 📡 WebSocket endpoint: `ws://localhost:3001`
- 🏥 Health check: `http://localhost:3001/health`
- 📊 API info: `http://localhost:3001/api/info`

### 5. Test the Agent

Open `http://localhost:3001` in your browser to interact with the agent through the web UI.

## 🛠️ Available Agent Tools

### Navigation Tool

- **Purpose**: Navigate users to different pages
- **Usage**: "take me to dashboard", "go to profile", "let's go to settings"
- **Available Routes**:
  - Home (`/`)
  - Dashboard (`/dashboard`)
  - Profile (`/settings/profile`)
  - Settings (`/settings`)

### Notification Tool

- **Purpose**: Show notifications to users
- **Usage**: "show me a success message", "warn the user about something"
- **Types**: info, success, warning, error
- **Customizable duration**

### UI Action Tool

- **Purpose**: Control UI elements
- **Usage**: "open the modal", "refresh the data", "toggle the sidebar"
- **Available Actions**:
  - `openModal` / `closeModal`
  - `refreshData`
  - `updateTheme`
  - `toggleSidebar`

## 📡 WebSocket Events

### From Frontend to Agent

```javascript
// Send user message
socket.emit("userMessage", { message: "take me to dashboard" });
```

### From Agent to Frontend

```javascript
// Agent response
socket.on("agentResponse", (data) => {
  console.log(data.message);
});

// Navigation instruction
socket.on("navigate", (data) => {
  // data: { action: 'navigate', path: '/dashboard', page: 'dashboard' }
  window.location.href = data.path;
});

// Notification
socket.on("notification", (data) => {
  // data: { action: 'notification', message: '...', type: 'success', duration: 5000 }
  showNotification(data.message, data.type);
});

// UI Action
socket.on("uiAction", (data) => {
  // data: { action: 'uiAction', uiAction: 'openModal', payload: {...} }
  performUIAction(data.uiAction, data.payload);
});
```

## 🔧 Adding New Tools

The modular architecture makes it easy to add new capabilities:

### 1. Create a New Tool File

```typescript
// src/tools/myNewTool.ts
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import type { ToolContext } from "../types/index.js";

export function createMyNewTool(context: ToolContext) {
  return new DynamicStructuredTool({
    name: "myNewAction",
    description: "Description of what this tool does",
    schema: z.object({
      param1: z.string().describe("Parameter description"),
      param2: z.number().optional(),
    }),
    func: async ({ param1, param2 }) => {
      if (context.socket) {
        context.socket.emit("myNewAction", {
          action: "myNewAction",
          param1,
          param2,
          timestamp: new Date().toISOString(),
        });
      }
      return `Action completed: ${param1}`;
    },
  });
}
```

### 2. Add to Tools Index

```typescript
// src/tools/index.ts
import { createMyNewTool } from "./myNewTool.js";

export function createAllTools(context: ToolContext) {
  return [
    createNavigationTool(context),
    createNotificationTool(context),
    createUIActionTool(context),
    createMyNewTool(context), // Add your new tool here
  ];
}
```

### 3. Update System Prompt

```typescript
// src/agent/index.ts - Add to getSystemPrompt()
4. **My New Action**: Use myNewAction tool for specific functionality
```

### 4. Handle on Frontend

```javascript
socket.on("myNewAction", (data) => {
  // Implement the frontend logic
  console.log("New action received:", data);
});
```

## 🌐 Integration Examples

### React Hook

```jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function useAIAgent() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("navigate", (data) => {
      router.push(data.path);
    });

    newSocket.on("notification", (data) => {
      toast[data.type](data.message);
    });

    newSocket.on("uiAction", (data) => {
      switch (data.uiAction) {
        case "openModal":
          setModalOpen(true);
          break;
        case "refreshData":
          refetchData();
          break;
      }
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = (message) => {
    socket?.emit("userMessage", { message });
  };

  return { sendMessage };
}
```

### Vue Composable

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";

const socket = ref(null);

onMounted(() => {
  socket.value = io("http://localhost:3001");

  socket.value.on("navigate", (data) => {
    router.push(data.path);
  });

  socket.value.on("notification", (data) => {
    $notify({
      type: data.type,
      message: data.message,
    });
  });
});

onUnmounted(() => {
  socket.value?.close();
});

const sendMessage = (message) => {
  socket.value?.emit("userMessage", { message });
};
</script>
```

## 📁 Project Structure Details

### `/src/agent/`

Contains the main AI agent class that handles LangChain integration and message processing.

### `/src/tools/`

Individual tool modules. Each tool is responsible for a specific capability:

- `navigation.ts` - Page navigation
- `notification.ts` - User notifications
- `uiAction.ts` - UI control actions
- `example.ts` - Example tools for reference

### `/src/server/`

Express server setup with Socket.IO integration for real-time communication.

### `/src/config/`

Centralized configuration management for server and agent settings.

### `/src/types/`

TypeScript type definitions for events, configurations, and interfaces.

### `/public/`

Static files served by Express, including the web UI for testing.

## 🔧 Development Scripts

```bash
# Start development server
bun run dev

# Start production server
bun run start

# Build for production
bun run build

# Type checking
bun run lint
```

## 🌍 Environment Variables

- `OLLAMA_BASE_URL`: Ollama server URL (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model to use (default: mistral)
- `PORT`: Server port (default: 3001)
- `CORS_ORIGIN`: CORS origin (default: \*)
- `VERBOSE`: Enable verbose logging (default: false)

## 🏭 Production Deployment

### Security Considerations

1. **CORS**: Update `CORS_ORIGIN` to specific domains
2. **Authentication**: Add user authentication for WebSocket connections
3. **Rate Limiting**: Implement rate limiting for agent requests
4. **Input Validation**: Validate all incoming WebSocket messages

### Scaling Considerations

1. **Redis Adapter**: Use Redis adapter for Socket.IO clustering
2. **Load Balancing**: Distribute across multiple server instances
3. **Monitoring**: Add logging and monitoring for WebSocket connections
4. **Database**: Add persistent storage for user sessions and agent state

### Example Production Setup

```typescript
// For production, update src/config/index.ts
export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || "3001"),
  corsOrigin: process.env.CORS_ORIGIN || "https://yourdomain.com",
  staticPath: path.join(__dirname, "../../public"),
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Add your tool in `src/tools/`
4. Update the tools index and agent system prompt
5. Add tests and documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using Bun, TypeScript, LangChain, and Socket.IO**
