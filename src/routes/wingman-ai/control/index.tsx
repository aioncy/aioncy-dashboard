import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../dashboard-layout";
import { AIControlPage } from "./AIControlPage";

export const wingmanAiControlRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai/control",
  component: AIControlPage,
});