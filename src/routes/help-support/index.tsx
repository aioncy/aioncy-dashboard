import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { HelpSupportPage } from "./HelpSupportPage";

export const helpSupportRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/help-support",
  component: HelpSupportPage,
});
