// Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL
    const hash = window.location.hash;
    const token = hash
      .substring(1)
      .split('&')
      .find((el) => el.startsWith('access_token='))
      ?.split('=')[1];

    if (token != null) {
      // Lưu token vào localStorage
      localStorage.setItem('spotifyAccessToken', token);
      localStorage.setItem("userLoggedIn", "true");
      navigate('/dashboard'); // Chuyển hướng đến trang dashboard sau khi có token
    } else {
      console.error('Token không tìm thấy.');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Logging in...</h2>
    </div>
  );
};

export default Callback;
