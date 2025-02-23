import React, { Suspense } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Loading from "./components/Loading/Loading"
import NavBar from "./components/NavBar/NavBar"
import { I18nextProvider } from "react-i18next"
import i18n from "./i18n"
import "./app.css"

const HomePage = React.lazy(() => import("./pages/Home/HomePage"))
const ErrorPage = React.lazy(() => import("./pages/Error/ErrorPage"))

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <NavBar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
    </I18nextProvider>
  )
}

export default App
