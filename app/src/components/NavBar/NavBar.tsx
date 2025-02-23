import React from "react"
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch"
import "./NavBar.modules.css"
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch"

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-items">
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </nav>
  )
}

export default NavBar
