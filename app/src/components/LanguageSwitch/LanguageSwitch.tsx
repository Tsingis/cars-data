import React from "react"
import { useTranslation } from "react-i18next"
import "./LanguageSwitch.modules.css"

const LanguageSwitch = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fi" : "en"
    i18n.changeLanguage(newLang)
  }

  return (
    <button onClick={toggleLanguage} className="language-switch">
      {i18n.language === "en" ? "FI" : "EN"}
    </button>
  )
}

export default LanguageSwitch
