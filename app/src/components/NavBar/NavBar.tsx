import React from "react"
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch"
import "./NavBar.modules.css"

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-items">
        <LanguageSwitch />
      </div>
    </nav>
  )
}

export default NavBar
