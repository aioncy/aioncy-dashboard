import { Route } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../../dashboard-layout";
import { ChannelsPage } from "./ChannelsPage";

export const wingmanAiChannelsRoute = new Route({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wingman-ai/channels",
  component: ChannelsPage,
});
