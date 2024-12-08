// src/spotify.js
import SpotifyWebApi from 'spotify-web-api-js';

// Tạo một thể hiện mới của Spotify API
const spotifyApi = new SpotifyWebApi();

// Bạn cần thêm Access Token vào đây
spotifyApi.setAccessToken('19cbbf609a00420e9869fe84b33785ea');  // Thay 'YOUR_SPOTIFY_ACCESS_TOKEN' bằng token của bạn

export default spotifyApi;
