import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { AnalyticsPage } from "./AnalyticsPage";

export const analyticsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/analytics",
  component: AnalyticsPage,
});
