import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import "./styles/app.css";
import { App } from "./shell/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider i18n={{}}>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
