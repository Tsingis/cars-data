import React from "react"
import "./ErrorPage.modules.css"

type ErrorPageProps = {
  message: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-text">
        <h1>Error</h1>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ErrorPage
