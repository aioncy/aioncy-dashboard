import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../dashboard-layout";
import { WingmanAIControlPage } from "../subpages";

export const wingmanAiControlRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai/control",
  component: WingmanAIControlPage,
});