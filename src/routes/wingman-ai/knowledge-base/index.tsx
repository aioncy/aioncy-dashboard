import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../dashboard-layout";
import { KnowledgeBasePage } from "./KnowledgeBasePage";

export const wingmanAiKnowledgeBaseRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai/knowledge-base",
  component: KnowledgeBasePage,
});
