import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import type { ToolContext } from "../types/index.js";

// Example: Data fetching tool
export function createDataFetchTool(context: ToolContext) {
  return new DynamicStructuredTool({
    name: "fetchData",
    description:
      "Fetch data from a specific endpoint and display it to the user",
    schema: z.object({
      endpoint: z.string().describe("The API endpoint to fetch data from"),
      displayFormat: z
        .enum(["table", "list", "cards"])
        .optional()
        .describe("How to display the data"),
    }),
    func: async ({ endpoint, displayFormat = "table" }) => {
      if (context.socket) {
        // Send data fetch instruction to frontend
        context.socket.emit("dataFetch", {
          action: "dataFetch",
          endpoint,
          displayFormat,
          timestamp: new Date().toISOString(),
        });
        console.log(
          `📊 [WEBSOCKET] Sent data fetch instruction: ${endpoint} (${displayFormat})`
        );
      } else {
        console.log(
          `📊 [FALLBACK] Fetch data from: ${endpoint} (${displayFormat})`
        );
      }
      return `Instructed frontend to fetch data from ${endpoint} and display as ${displayFormat}`;
    },
  });
}

// Example: Form validation tool
export function createFormValidationTool(context: ToolContext) {
  return new DynamicStructuredTool({
    name: "validateForm",
    description: "Validate a form and show validation errors to the user",
    schema: z.object({
      formId: z.string().describe("The ID of the form to validate"),
      showErrors: z
        .boolean()
        .optional()
        .describe("Whether to show validation errors immediately"),
    }),
    func: async ({ formId, showErrors = true }) => {
      if (context.socket) {
        context.socket.emit("formValidation", {
          action: "formValidation",
          formId,
          showErrors,
          timestamp: new Date().toISOString(),
        });
        console.log(
          `✅ [WEBSOCKET] Sent form validation instruction: ${formId}`
        );
      } else {
        console.log(`✅ [FALLBACK] Validate form: ${formId}`);
      }
      return `Instructed frontend to validate form ${formId}`;
    },
  });
}
