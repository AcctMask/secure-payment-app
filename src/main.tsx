import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// IMPORTANT:
// This must wrap *everything* that calls useAppContext.
// Your blank page error ("useAppContext must be used within an AppProvider")
// happens when a route renders outside this provider.
import { AppProvider } from "./contexts/AppContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
