import type { ToolContext } from "../types/index.js";
import { createNavigationTool } from "./navigation.js";
import { createNotificationTool } from "./notification.js";
import { createUIActionTool } from "./uiAction.js";

export function createAllTools(context: ToolContext) {
  return [
    createNavigationTool(context),
    createNotificationTool(context),
    createUIActionTool(context),
  ];
}

export { createNavigationTool, createNotificationTool, createUIActionTool };
export { routeMap } from "./navigation.js";
