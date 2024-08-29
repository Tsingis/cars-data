import React from "react"
import { useLocation } from "react-router-dom"
import "./ErrorPage.modules.css"

type LocationState = {
  message?: string
}

const ErrorPage: React.FC = () => {
  const location = useLocation()
  const { state } = location
  const message =
    (state as LocationState)?.message ?? "An unexpected error occurred"

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
