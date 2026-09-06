import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../../dashboard-layout";
import { ChatWidgetPage } from "./ChatWidgetPage";

export const wingmanAiChatWidgetRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai/channels/chat-widget",
  component: ChatWidgetPage,
});
