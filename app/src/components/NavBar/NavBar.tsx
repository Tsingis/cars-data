import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <nav
      data-testid="navbar"
      className={styles.navbar}
      aria-label="Main Navigation"
    >
      <nav className={styles.navbarItems} aria-label="Navigation Items">
        <LanguageSwitch />
        <ThemeSwitch />
      </nav>
    </nav>
  );
};

export default NavBar;
