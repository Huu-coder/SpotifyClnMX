import React from "react";
import styles from "./styles/navbar.module.css"; // Import the CSS Module

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li><a href="http://localhost:3000/Dashboard" className={styles.navItem}>Home</a></li>
        <li><a href="http://localhost:3000/Library" className={styles.navItem}>Your Library</a></li>
        <li><a href="http://localhost:3000/Explorer" className={styles.navItem}>Explore More</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
