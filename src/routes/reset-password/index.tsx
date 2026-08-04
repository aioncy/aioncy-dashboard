import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { ResetPasswordPage } from "./ResetPasswordPage";

export const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});
