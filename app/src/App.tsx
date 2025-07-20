import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import Loading from "./components/Loading/Loading";
import NavBar from "./components/NavBar/NavBar";
import i18n from "./i18n";
import "./app.css";

const HomePage = React.lazy(() => import("./pages/Home/HomePage"));
const ErrorPage = React.lazy(() => import("./pages/Error/ErrorPage"));

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <NavBar />
        <Suspense fallback={<Loading size="6x" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
    </I18nextProvider>
  );
};

export default App;
