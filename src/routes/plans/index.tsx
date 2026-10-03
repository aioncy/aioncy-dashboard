import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { PlansPage } from "./PlansPage";

export const plansRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/plans",
  component: PlansPage,
});
