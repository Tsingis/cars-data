import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styles from "./ThemeSwitch.module.css";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div data-testid="themeswitch" className={styles.themeSwitchContainer}>
      <button
        className={`${styles.themeSwitchButton} ${theme === "dark" ? styles.active : ""}`}
        onClick={() => changeTheme("dark")}
        type="button"
        aria-label="Change theme to dark"
      >
        <FontAwesomeIcon icon={faMoon} />
      </button>
      <button
        className={`${styles.themeSwitchButton} ${theme === "light" ? styles.active : ""}`}
        onClick={() => changeTheme("light")}
        type="button"
        aria-label="Change theme to light"
      >
        <FontAwesomeIcon icon={faSun} />
      </button>
    </div>
  );
};

export default ThemeSwitch;
