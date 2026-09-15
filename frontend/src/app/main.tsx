import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { authStore } from "../features/auth/model/auth.store";
import "../shared/styles/tailwind.css";
import "../shared/styles/globals.css";

async function bootstrap(): Promise<void> {
  await authStore.restoreSession();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void bootstrap();
