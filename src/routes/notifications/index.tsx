import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { NotificationsPage } from "./NotificationsPage";

export const notificationsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/notifications",
  component: NotificationsPage,
});
