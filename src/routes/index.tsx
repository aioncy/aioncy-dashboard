import { Route, redirect } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
