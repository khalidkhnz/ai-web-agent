import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import type { ToolContext, RouteMap, NavigationEvent } from "../types/index.js";

// Route mapping configuration
export const routeMap: RouteMap = {
  home: "/",
  dashboard: "/dashboard",
  users: "/users",
  clients: "/clients",
  analytics: "/analytics",
  calendar: "/calendar",
  "user management": "/users", // i am adding aliases for easier access
  "client management": "/clients",
  "user page": "/users",
  "client page": "/clients",
};

export function createNavigationTool(context: ToolContext) {
  return new DynamicStructuredTool({
    name: "navigateTo",
    description:
      "Use this tool to navigate the user to different pages in the web application. You should use this tool whenever the user wants to go somewhere or visit a page.",
    schema: z.object({
      page: z
        .string()
        .describe(
          "The page the user wants to visit. Available options: home, dashboard, users, clients, analytics, calendar, user management, client management"
        ),
    }),
    func: async ({ page }) => {
      const key = page.toLowerCase().trim();
      const path = routeMap[key] ?? `/${key.replace(/\s+/g, "-")}`;

      // Send navigation instruction to frontend via WebSocket
      if (context.socket) {
        const navigationEvent: NavigationEvent = {
          action: "navigate",
          path: path,
          page: page,
          timestamp: new Date().toISOString(),
        };

        context.socket.emit("navigate", navigationEvent);
        console.log(
          `🔀 [WEBSOCKET] Sent navigation instruction to frontend: ${path}`
        );
      } else {
        console.log(
          `🔀 [FALLBACK] Navigate to ${path} (no frontend connected)`
        );
      }

      return `Successfully instructed frontend to navigate to ${path}`;
    },
  });
}
