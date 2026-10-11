import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard-layout";
import { ConversationsPage } from "./ConversationsPage";

export interface ConversationsSearch {
  /** Conversation to open on arrival. */
  conversation?: string;
  /** Set when arriving from the notification inbox — shows a breadcrumb back. */
  from?: "notifications";
}

export const conversationsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/conversations",
  validateSearch: (search: Record<string, unknown>): ConversationsSearch => ({
    conversation: typeof search.conversation === "string" ? search.conversation : undefined,
    from: search.from === "notifications" ? "notifications" : undefined,
  }),
  component: ConversationsPage,
});
