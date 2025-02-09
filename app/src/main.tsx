import React from "react"
import ReactDOM from "react-dom/client"
import i18n from "./i18n"
import App from "./App.tsx"

const storedLanguage = localStorage.getItem("language")
if (storedLanguage) {
  i18n.changeLanguage(storedLanguage)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
