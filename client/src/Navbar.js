import React, { useState, useEffect } from "react";
import styles from "./styles/navbar.module.css"; // Import the CSS Module
import modalStyles from "./styles/Modal.module.css";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem theme có trong localStorage không
    const savedTheme = localStorage.getItem('darkmode');
    if (savedTheme === 'true') {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logout = () => {
    // Xóa các key khỏi localStorage khi đăng xuất
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('userLoggedIn');

    console.log("Đã đăng xuất");
    // Điều hướng về trang đăng nhập
    navigate('/login');
  };


  return (
    <nav className={styles.navbar}>
      <div>
        <ul className={styles.navList}>
          <li>
            <a href="http://localhost:3000/Dashboard" className={styles.navItem}>
              <img src="./img/spotify.png" alt="" height={"35px"} />
            </a>
          </li>
          <li>
            <a href="http://localhost:3000/Library" className={styles.navItem}>
              <img src="./img/library.svg" alt="" height={"20px"} />
              <p className={styles.navP}>&emsp; Library</p>
            </a>
          </li>
          <li>
            <a href="http://localhost:3000/Explorer" className={styles.navItem}>
              <img src="./img/search.svg" alt="" height={"20px"} />
              <p className={styles.navP}>&emsp; Explore More</p>
            </a>
          </li>
        </ul>
      </div>
      <div>
        <ul className={styles.navList}>
          <div className={`${styles.app} ${theme === "dark" ? styles.dark : styles.light}`}>
            <li>
              <button onClick={toggleModal} className={styles.openButton}>Your Account</button>
            </li>

            {isModalOpen && (
              <div className={modalStyles.modal}>
                <div className={modalStyles.modalContent}>
                  <button onClick={logout} className={modalStyles.button}>Đăng xuất</button>
                  <button onClick={toggleModal} className={modalStyles.closeButton}>Đóng</button>
                </div>
              </div>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
