import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../dashboard-layout";
import { LeadDetailPage } from "./LeadDetailPage";

export const leadDetailRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/leads/$leadId",
  component: LeadDetailPage,
});
