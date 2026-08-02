import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { SettingsPage } from "./SettingsPage";

export const settingsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});
