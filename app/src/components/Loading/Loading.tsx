import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import styles from "./Loading.module.css"

type LoadingProps = {
  size?: "xs" | "sm" | "lg" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x"
}

const Loading: React.FC<LoadingProps> = ({ size = "1x" }) => (
  <div
    data-testid="loading"
    className={styles.loadingContainer}
    aria-label="loading"
  >
    <FontAwesomeIcon icon={faSpinner} spin size={size} />
  </div>
)

export default Loading
