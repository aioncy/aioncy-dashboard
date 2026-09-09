import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { AccountPage } from "./AccountPage";

export const accountRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/account",
  component: AccountPage,
});
