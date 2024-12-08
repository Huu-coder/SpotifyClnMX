import { useState, useEffect } from "react";
import Player from "./Player";
import { Container, Button, Card } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import "./styles/Explorer.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import buttuncss from "./styles/BackButton.module.css";

const spotifyApi = new SpotifyWebApi({
  clientId: "19cbbf609a00420e9869fe84b33785ea",
});

// Define an expanded list of music genres
const MUSIC_GENRES = [
  "pop", "rock", "hip hop", "classical", "jazz",
  "electronic", "country", "r&b", "indie",
  "metal", "blues", "folk", "reggae",
  "punk", "alternative", "soul"
];

export default function Explorer() {
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const [playingTrack, setPlayingTrack] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [recommendations, setRecommendations] = useState({});
  const [showLyrics, setShowLyrics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function chooseTrack(track) {
    setPlayingTrack(null);
    setTimeout(() => {
      setPlayingTrack(track);
      setLyrics("");
      setShowLyrics(true);
    }, 0);
  }

  // Fetch lyrics when a track is selected
  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.name,
          artist: playingTrack.artists[0].name,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      })
      .catch((err) => {
        console.error("Error fetching lyrics:", err);
        setLyrics("Lyrics not found.");
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    // Enhanced recommendations fetching
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);

        // Fetch user's top tracks
        const topTracks = await spotifyApi.getMyTopTracks({ limit: 10 });

        // Fetch tracks for multiple genres
        const genreRecommendations = {};

        for (const genre of MUSIC_GENRES) {
          try {
            const genreTracks = await spotifyApi.searchTracks(`genre:${genre}`, { limit: 10 });
            genreRecommendations[genre] = genreTracks.body.tracks.items;
          } catch (genreErr) {
            console.error(`Error fetching ${genre} tracks:`, genreErr);
            genreRecommendations[genre] = [];
          }
        }

        setRecommendations({
          topTracks: topTracks.body.items,
          ...genreRecommendations
        });
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [accessToken]);

  const handleBackClick = () => {
    setShowLyrics(false);
    setLyrics("");
    setPlayingTrack(null);
  };

  const renderTrackSection = (tracks, title) => (
    tracks.length > 0 && (
      <div>
        <h2>{title}</h2>
        <div className="track-list">
          {tracks.map((track) => (
            <Card
              key={track.uri}
              style={{ width: "180px", margin: "10px", cursor: "pointer" }}
              onClick={() => chooseTrack(track)}
            >
              <Card.Img variant="top" src={track.album.images[0]?.url} />
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Text>{track.artists[0].name}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div>
      <Navbar />
      <Container className="d-flex flex-column py-2 cont-explorer" style={{ height: "100vh" }}>
        <Button
          onClick={handleBackClick}
          variant="secondary"
          className={buttuncss.butt}
          style={{ display: showLyrics ? "block" : "none" }}
        >
          Back
        </Button>

        <Sidebar accessToken={accessToken} chooseTrack={chooseTrack} />

        <div className="ex-container" style={{ overflowY: "auto" }}>
          {isLoading ? (
            <div className="text-center">Loading recommendations...</div>
          ) : showLyrics ? (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics ? lyrics : "Lyrics not available"}
            </div>
          ) : (
            <>
              {/* Top 10 Songs */}
              {renderTrackSection(recommendations.topTracks || [], "Your Top 10 Songs")}

              {/* Render tracks for each genre */}
              {MUSIC_GENRES.map((genre) =>
                renderTrackSection(
                  recommendations[genre] || [],
                  `Top 10 ${genre.charAt(0).toUpperCase() + genre.slice(1)} Songs`
                )
              )}
            </>
          )}
        </div>

        <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </Container>
    </div>
  );
}
