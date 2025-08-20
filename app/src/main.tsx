import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import i18n from "./i18n/i18n.ts";

const storedLanguage = localStorage.getItem("language");
if (storedLanguage) {
  i18n.changeLanguage(storedLanguage);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
