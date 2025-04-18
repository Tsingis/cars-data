import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"
import styles from "./ThemeSwitch.module.css"

const ThemeSwitch = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "light"
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <div data-testid="themeswitch" className={styles.themeSwitchContainer}>
      <button
        className={`${styles.themeSwitchButton} ${theme === "dark" ? styles.active : ""}`}
        onClick={() => changeTheme("dark")}
        aria-label="Change theme to dark"
      >
        <FontAwesomeIcon icon={faMoon} />
      </button>
      <button
        className={`${styles.themeSwitchButton} ${theme === "light" ? styles.active : ""}`}
        onClick={() => changeTheme("light")}
        aria-label="Change theme to light"
      >
        <FontAwesomeIcon icon={faSun} />
      </button>
    </div>
  )
}

export default ThemeSwitch
