import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./app.css"
import Loading from "./components/Loading/Loading"
import React, { Suspense } from "react"

const HomePage = React.lazy(() => import("./pages/Home/HomePage"))
const ErrorPage = React.lazy(() => import("./pages/Error/ErrorPage"))

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
