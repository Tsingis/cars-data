import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import styles from "./Loading.module.css";

type LoadingProps = {
  size?: "xs" | "sm" | "lg" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x";
};

const Loading: React.FC<LoadingProps> = ({ size = "1x" }) => (
  <div data-testid="loading" className={styles.loadingContainer}>
    <FontAwesomeIcon icon={faSpinner} spin size={size} aria-label="loading" />
  </div>
);

export default Loading;
