import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CursorProvider } from "./components/CursorProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CursorProvider>
    <App />
  </CursorProvider>
);
