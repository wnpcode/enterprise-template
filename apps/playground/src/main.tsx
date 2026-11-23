import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ToastProvider, TooltipProvider } from "@wnp_code/design-system";
import "./index.css";
import { App, type PlaygroundSkin } from "./App";
import { defaultShell } from "./shell/config";

function Root() {
  const [brand, setBrand] = useState(false);
  const [skin, setSkin] = useState<PlaygroundSkin>("flat");
  const [shell, setShell] = useState(defaultShell);
  return (
    <ThemeProvider brand={brand ? "acme" : undefined} skin={skin === "flat" ? undefined : skin}>
      <TooltipProvider>
        <ToastProvider>
          <App brand={brand} onBrandChange={setBrand} skin={skin} onSkinChange={setSkin} shell={shell} onShellChange={setShell} />
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
