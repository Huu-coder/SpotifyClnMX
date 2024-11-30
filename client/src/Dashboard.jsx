import { useState, useEffect } from "react"
import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import './styles/Dashboard.css'
import Navbar from "./Navbar";

function handleSpotifyError() {
    // Kiểm tra xem có thẻ nào với class '_ErrorRSWP' không
    const errorElement = document.querySelector('._ErrorRSWP');

    if (errorElement) {
        // Xóa 2 key trong localStorage
        localStorage.removeItem('spotifyAccessToken');
        localStorage.removeItem('userLoggedIn');

        // Điều hướng về trang đăng nhập
        window.location.href = './Login';
    }
}

const handleSpotifySearch = async () => {
    try {
        const response = await fetch('https://api.spotify.com/v1/search/?type=track&q=He', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('spotifyAccessToken')}`,
            },
        });

        if (!response.ok) {
            // Nếu gặp lỗi 401
            if (response.status === 401) {
                console.error('Unauthorized! Redirecting to login...');
                localStorage.removeItem('spotifyAccessToken'); // Xoá token
                localStorage.removeItem('userLoggedIn'); // Xoá trạng thái đăng nhập
                window.location.href = './Login'; // Chuyển hướng
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Spotify data:', data);

    } catch (error) {
        console.error('Error fetching Spotify data:', error.message);
    }
};


const spotifyApi = new SpotifyWebApi({
  clientId: "19cbbf609a00420e9869fe84b33785ea",
})

export default function Dashboard({ code }) {
  const accessToken = localStorage.getItem("spotifyAccessToken")
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }

  useEffect(() => {
    if (!playingTrack) return

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    const interval = setInterval(() => {
        console.log("Updated");
        handleSpotifyError();
        handleSpotifySearch();
    }, 1000);

    // Cleanup để ngăn rò rỉ bộ nhớ khi component unmount
    return () => clearInterval(interval);
}, []); // Mảng rỗng giúp chỉ cài đặt interval một lần


  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <div>
    <Navbar />
    <Container className="d-flex flex-column py-2 cont-dash" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="mu-container" style={{ overflowY: "auto" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
    </div>
  )
}
