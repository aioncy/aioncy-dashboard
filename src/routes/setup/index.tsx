import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { SetupPage } from "./SetupPage";

export const setupRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/setup",
  component: SetupPage,
});
