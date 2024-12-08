import { useState, useEffect } from "react";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Row, Col } from "react-bootstrap"; // Import for responsive layout
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import './styles/Library.css';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Initialize Spotify API with your client ID
const spotifyApi = new SpotifyWebApi({
  clientId: "19cbbf609a00420e9869fe84b33785ea",
});

export default function Library() {
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const [likedTracks, setLikedTracks] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  // Fetch liked tracks (saved songs) from the Spotify API
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);

    // Get user's saved tracks
    spotifyApi.getMySavedTracks().then(
      (res) => {
        const tracks = res.body.items.map(item => {
          const track = item.track;
          const largestAlbumImage = track.album.images.reduce(
            (largest, image) => {
              if (image.height > largest.height) return image;
              return largest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: largestAlbumImage.url,
          };
        });
        setLikedTracks(tracks);
      },
      (err) => {
        console.error('Error fetching liked tracks:', err);
      }
    );
  }, [accessToken]);

  // Handle selecting a track to play
  function chooseTrack(track) {
    setPlayingTrack(track);
    setLyrics(""); // Reset lyrics when a new track is selected
  }

  // Fetch lyrics for the selected track
  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  return (
    <div>
      <Navbar />
      <Sidebar accessToken={accessToken} chooseTrack={chooseTrack} />
      <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
        <Row>
          {/* Main content on the left (Liked Songs and Player) */}
          <Col sm={8} style={{ paddingRight: "20px" }}>
            <div className="lib-container" style={{ overflowY: "auto", maxHeight: "calc(100vh - 70px)" }}>
              {likedTracks.length === 0 ? (
                <p>No liked tracks available. Please log in to Spotify to see your library.</p>
              ) : (
                likedTracks.map((track) => (
                  <TrackSearchResult
                    track={track}
                    key={track.uri}
                    chooseTrack={chooseTrack}
                  />
                ))
              )}
            </div>
            {playingTrack && (
              <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
              </div>
            )}
          </Col>

          {/* Sidebar on the right for displaying lyrics */}
          <Col sm={4} className="lyrics-sidebar">
            {playingTrack && (
              <div className="lyrics-container">
                <h4>{playingTrack.title} - {playingTrack.artist}</h4>
                <div className="lyrics-text">{lyrics || "No lyrics available / found."}</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
