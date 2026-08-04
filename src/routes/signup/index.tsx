import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { SignUpPage } from "./SignUpPage";

export const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignUpPage,
});
