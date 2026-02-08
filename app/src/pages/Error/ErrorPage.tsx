import type React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import styles from "./ErrorPage.module.css";

type LocationState = {
  message?: string;
};

const ErrorPage: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const message = (state as LocationState)?.message;

  return (
    <section
      data-testid="error-page"
      className={styles.errorContainer}
      aria-label="Error Page"
    >
      <div data-testid="error" className={styles.error}>
        <h1>{t(($) => $.errorMessage.title)}</h1>
        <p>{message ?? t(($) => $.errorMessage.general)}</p>
      </div>
    </section>
  );
};

export default ErrorPage;
