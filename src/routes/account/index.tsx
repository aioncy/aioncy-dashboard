import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { AccountPage } from "./AccountPage";

export interface AccountSearch {
  tab?: "profile" | "security" | "notifications";
}

const ACCOUNT_TABS = ["profile", "security", "notifications"] as const;

export const accountRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/account",
  validateSearch: (search: Record<string, unknown>): AccountSearch => ({
    tab: ACCOUNT_TABS.find((tab) => tab === search.tab),
  }),
  component: AccountPage,
});
