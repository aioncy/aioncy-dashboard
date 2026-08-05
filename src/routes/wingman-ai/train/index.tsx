import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../dashboard-layout";
import { WingmanAITrainPage } from "../subpages";

export const wingmanAiTrainRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai/train",
  component: WingmanAITrainPage,
});