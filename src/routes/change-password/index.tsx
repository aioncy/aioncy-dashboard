import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { ChangePasswordPage } from "./ChangePasswordPage";

export const changePasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/change-password",
  component: ChangePasswordPage,
});
