import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { LoginPage } from "./LoginPage";

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});