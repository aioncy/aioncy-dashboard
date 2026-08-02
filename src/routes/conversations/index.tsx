import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { ConversationsPage } from "./ConversationsPage";

export const conversationsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/conversations",
  component: ConversationsPage,
});
