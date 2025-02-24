import React from "react"
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch"
import "./NavBar.modules.css"
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch"

const NavBar = () => {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-items" aria-label="Navigation Items">
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </nav>
  )
}

export default NavBar
