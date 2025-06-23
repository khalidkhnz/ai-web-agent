import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import type { ToolContext, UIActionEvent } from "../types/index.js";

export function createUIActionTool(context: ToolContext) {
  return new DynamicStructuredTool({
    name: "performUIAction",
    description:
      "Perform various UI actions on the frontend like opening modals, updating data, etc.",
    schema: z.object({
      action: z
        .enum([
          "openModal",
          "closeModal",
          "refreshData",
          "updateTheme",
          "toggleSidebar",
        ])
        .describe("The UI action to perform"),
      payload: z.any().optional().describe("Additional data for the action"),
    }),
    func: async ({ action, payload }) => {
      if (context.socket) {
        const uiActionEvent: UIActionEvent = {
          action: "uiAction",
          uiAction: action,
          payload,
          timestamp: new Date().toISOString(),
        };

        context.socket.emit("uiAction", uiActionEvent);
        console.log(
          `🎛️ [WEBSOCKET] Sent UI action: ${action}`,
          payload ? `with payload: ${JSON.stringify(payload)}` : ""
        );
      } else {
        console.log(
          `🎛️ [FALLBACK] UI Action: ${action}`,
          payload ? `with payload: ${JSON.stringify(payload)}` : ""
        );
      }
      return `UI action performed: ${action}`;
    },
  });
}
