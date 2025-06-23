import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import type { ToolContext, NotificationEvent } from "../types/index.js";

export function createNotificationTool(context: ToolContext) {
  return new DynamicStructuredTool({
    name: "showNotification",
    description: "Show a notification message to the user on the frontend",
    schema: z.object({
      message: z.string().describe("The notification message to display"),
      type: z
        .enum(["info", "success", "warning", "error"])
        .describe("The type of notification"),
      duration: z
        .number()
        .optional()
        .describe("Duration in milliseconds (optional)"),
    }),
    func: async ({ message, type, duration = 5000 }) => {
      if (context.socket) {
        const notificationEvent: NotificationEvent = {
          action: "notification",
          message,
          type,
          duration,
          timestamp: new Date().toISOString(),
        };

        context.socket.emit("notification", notificationEvent);
        console.log(`🔔 [WEBSOCKET] Sent notification: ${type} - ${message}`);
      } else {
        console.log(`🔔 [FALLBACK] Notification: ${type} - ${message}`);
      }
      return `Notification sent: ${message}`;
    },
  });
}
