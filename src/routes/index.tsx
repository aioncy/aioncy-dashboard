import { Route } from "@tanstack/react-router";
import App from "../App";
import { Route as rootRoute } from "./__root";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});
