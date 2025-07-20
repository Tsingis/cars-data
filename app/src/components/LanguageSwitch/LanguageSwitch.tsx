import type React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitch.module.css";

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div
      data-testid="languageswitch"
      className={styles.languageSwitchContainer}
    >
      <button
        className={`${styles.languageSwitchButton} ${i18n.language === "en" ? styles.active : ""}`}
        onClick={() => changeLanguage("en")}
        type="button"
        aria-label="Change language to English"
      >
        EN
      </button>
      <button
        className={`${styles.languageSwitchButton} ${i18n.language === "fi" ? styles.active : ""}`}
        onClick={() => changeLanguage("fi")}
        type="button"
        aria-label="Change language to Finnish"
      >
        FI
      </button>
    </div>
  );
};

export default LanguageSwitch;
