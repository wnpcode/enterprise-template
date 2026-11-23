import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./app/styles.css";
import "./app/i18n";
import { App } from "./app/App";
import { env } from "./app/env";

async function enableMocks() {
  if (!import.meta.env.DEV || env.VITE_API_MOCK !== "1") return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocks()
  // tanpa catch, kegagalan worker (konteks http non-localhost, SW diblokir) membuat app tidak pernah dirender
  .catch((err: unknown) => console.error("[mock] MSW gagal aktif, request /api akan menuju server nyata:", err))
  .then(() =>
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    ),
  );
