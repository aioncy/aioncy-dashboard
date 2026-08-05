import { Route } from "@tanstack/react-router";
import { Route as rootRoute } from "../__root";
import { OnboardingPage } from "./OnboardingPage";

export const onboardingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});