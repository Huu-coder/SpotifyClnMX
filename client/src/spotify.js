// src/spotify.js
import SpotifyWebApi from 'spotify-web-api-js';

// Tạo một thể hiện mới của Spotify API
const spotifyApi = new SpotifyWebApi();

// Bạn cần thêm Access Token vào đây
spotifyApi.setAccessToken('YOUR_SPOTIFY_ACCESS_TOKEN');  // Thay 'YOUR_SPOTIFY_ACCESS_TOKEN' bằng token của bạn

export default spotifyApi;
