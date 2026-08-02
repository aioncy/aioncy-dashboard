import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { LeadsPage } from "./LeadsPage";

export const leadsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/leads",
  component: LeadsPage,
});
