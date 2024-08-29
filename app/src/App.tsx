import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./pages/Home/HomePage"
import ErrorPage from "./pages/Error/ErrorPage"
import "./app.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App
