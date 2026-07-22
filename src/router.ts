import { Router } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { componentsRoute } from "./routes/components";

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, componentsRoute]);

// Create the router instance
export const router = new Router({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
