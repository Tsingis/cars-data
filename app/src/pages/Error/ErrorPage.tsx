import React from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import styles from "./ErrorPage.module.css"

type LocationState = {
  message?: string
}

const ErrorPage: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useLocation()
  const message = (state as LocationState)?.message

  return (
    <div
      data-testid="errorpage"
      className={styles.errorContainer}
      aria-label="Error Page"
    >
      <div data-testid="error" className={styles.error}>
        <h1>{t("Error.Title")}</h1>
        <p>{message ?? t("Error.General")}</p>
      </div>
    </div>
  )
}

export default ErrorPage
