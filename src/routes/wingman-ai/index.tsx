import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { WingmanAiPage } from "./WingmanAiPage";

export const wingmanAiRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai",
  component: WingmanAiPage,
});
