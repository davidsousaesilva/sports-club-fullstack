import { RouterProvider as ReactRouterProvider } from "react-router";

import { appRouter } from "../router";

function RouterProvider() {
  return <ReactRouterProvider router={appRouter} />;
}

export { RouterProvider };
