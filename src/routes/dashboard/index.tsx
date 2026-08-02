import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { DashboardPage } from "./DashboardPage";

export const dashboardRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});
