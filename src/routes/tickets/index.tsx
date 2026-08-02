import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { TicketsPage } from "./TicketsPage";

export const ticketsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/tickets",
  component: TicketsPage,
});
