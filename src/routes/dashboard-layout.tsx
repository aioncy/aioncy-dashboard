import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import DashboardLayout from "../components/DashboardLayout";

export const dashboardLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
});
