import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MarcusPage } from "./MarcusPage";
import "./marcus.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MarcusPage />
  </StrictMode>,
);
