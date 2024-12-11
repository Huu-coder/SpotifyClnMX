import React from 'react';
import styles from './styles/contact.module.css'; // Import the renamed CSS Module
import emailjs from '@emailjs/browser';

function Contact() {

    const sendEmail = (e) => {
      e.preventDefault();
      // Send email using your preferred method (e.g., Axios, EmailJS, etc.)
      console.log('Email sent successfully!');

      emailjs.sendForm('service_tcooyat', 'template_5swp87m', e.target, 'OEaylcSXjNp1ai3r3')
    }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Contact Us</h1>
        <form className={styles.form} onSubmit={sendEmail}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" className={styles.input} placeholder="Email address" name='emailid' required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Content</label>
            <textarea name="message" id="mail" required ></textarea>
          </div>
          <button type="submit" className={styles.button}>Send</button>
        </form>
        <div className={styles.footer}>
          <a href="tel:+84384985235" className={styles.forgotPassword}> tel: xxxx xxx xxx </a>
          <a href="https://zalo.me/0384985235">Zalo Contact</a>
          <a href="https://www.facebook.com/profile.php?id=61553341873402">Facebook Contact</a>
          <a href="http://localhost:3000/dashboard">Back to home</a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
