import React from "react"
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch"
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch"
import styles from "./NavBar.module.css"

const NavBar = () => {
  return (
    <nav className={styles.navbar} aria-label="Main Navigation">
      <div className={styles.navbarItems} aria-label="Navigation Items">
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </nav>
  )
}

export default NavBar
