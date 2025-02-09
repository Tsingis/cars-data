import React from "react"
import { useTranslation } from "react-i18next"
import "./LanguageSwitch.modules.css"

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem("language", lng)
  }

  return (
    <div className="language-switch-container">
      <button
        className={`language-switch-button ${i18n.language === "en" ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={`language-switch-button ${i18n.language === "fi" ? "active" : ""}`}
        onClick={() => changeLanguage("fi")}
      >
        FI
      </button>
    </div>
  )
}

export default LanguageSwitch
