// Login.js
import React from 'react';
import logcss from './styles/Login.module.css'
const Login = () => {
  const clientId = '19cbbf609a00420e9869fe84b33785ea'; // Thay bằng Client ID của bạn
  const redirectUri = 'http://localhost:3000/SpotifyHandler'; // URL bạn đã cấu hình
  const scope = "ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing streaming app-remote-control user-read-email user-read-private playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-playback-position user-read-recently-played user-follow-read user-follow-modify";


  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  return (
    <div>
      <h2>Login to Spotify</h2>
      <a href={authUrl}>
        <button className={logcss.but}>Login with Spotify</button>
      </a>
    </div>
  );
};

export default Login;
