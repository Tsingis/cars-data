import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Error from "./pages/Error/Error"
import "./app.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  )
}

export default App
