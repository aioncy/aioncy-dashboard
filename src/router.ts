import { Router } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { componentsRoute } from "./routes/components";
import { dashboardLayoutRoute } from "./routes/dashboard-layout";
import { dashboardRoute } from "./routes/dashboard";
import { conversationsRoute } from "./routes/conversations";
import { ticketsRoute } from "./routes/tickets";
import { wingmanAiRoute } from "./routes/wingman-ai";
import { leadsRoute } from "./routes/leads";
import { analyticsRoute } from "./routes/analytics";
import { settingsRoute } from "./routes/settings";
import { helpSupportRoute } from "./routes/help-support";
import { loginRoute } from "./routes/login";
import { signupRoute } from "./routes/signup";
import { resetPasswordRoute } from "./routes/reset-password";
import { changePasswordRoute } from "./routes/change-password";

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  resetPasswordRoute,
  changePasswordRoute,
  componentsRoute,
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    conversationsRoute,
    ticketsRoute,
    wingmanAiRoute,
    leadsRoute,
    analyticsRoute,
    settingsRoute,
    helpSupportRoute,
  ]),
]);

// Create the router instance
export const router = new Router({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
