import { useState, useEffect } from "react";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Row, Col } from "react-bootstrap"; // Import for responsive layout
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import './styles/Library.css';
import Navbar from "./Navbar";

// Initialize Spotify API with your client ID
const spotifyApi = new SpotifyWebApi({
  clientId: "19cbbf609a00420e9869fe84b33785ea",
});

export default function Library() {
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const [likedTracks, setLikedTracks] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [classicalTracks, setClassicalTracks] = useState([]);
  const [popTracks, setPopTracks] = useState([]);
  const [picksForYou, setPicksForYou] = useState([]);

  // Fetch liked tracks (saved songs) from the Spotify API
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);

    // Get user's saved tracks
    spotifyApi.getMySavedTracks().then(
      (res) => {
        const tracks = res.body.items.map(item => {
          const track = item.track;
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => (image.height < smallest.height ? image : smallest),
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        });
        setLikedTracks(tracks);
      },
      (err) => {
        console.error('Error fetching liked tracks:', err);
      }
    );
  }, [accessToken]);

  // Fetch top tracks, classical, pop, and personalized picks
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);

    // Fetch top tracks (use a playlist or a chart for global top songs)
    spotifyApi.getPlaylistTracks("37i9dQZEVXbMDoHDwVN2tF") // Example of a global top 50 playlist
      .then(res => {
        const tracks = res.body.items.slice(0, 10).map(item => {
          const track = item.track;
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[0].url,
          };
        });
        setTopTracks(tracks);
      });

    // Fetch top classical tracks
    spotifyApi.searchTracks("classical", { limit: 10, offset: 0 })
      .then(res => {
        const tracks = res.body.tracks.items.map(item => {
          const track = item;
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[0].url,
          };
        });
        setClassicalTracks(tracks);
      });

    // Fetch top pop tracks
    spotifyApi.searchTracks("pop", { limit: 10, offset: 0 })
      .then(res => {
        const tracks = res.body.tracks.items.map(item => {
          const track = item;
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[0].url,
          };
        });
        setPopTracks(tracks);
      });

    // Fetch personalized recommendations ("Picks for You")
    spotifyApi.getRecommendations({ limit: 10 })
      .then(res => {
        const tracks = res.body.tracks.map(item => {
          const track = item;
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[0].url,
          };
        });
        setPicksForYou(tracks);
      });

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
      <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
        <Row>
          {/* Main content on the left (Liked Songs and Player) */}
          <Col sm={8} style={{ paddingRight: "20px" }}>
            <div className="mu-container" style={{ overflowY: "auto", maxHeight: "calc(100vh - 70px)" }}>
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
                <div className="lyrics-text">{lyrics || "No lyrics available."}</div>
              </div>
            )}
          </Col>
        </Row>

        {/* Display top tracks, classical, pop, and picks for you */}
        <Row>
          <Col sm={12}>
            <h3>Top 10 Songs</h3>
            {topTracks.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}

            <h3>Top 10 Classical Tracks</h3>
            {classicalTracks.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}

            <h3>Top 10 Pop Tracks</h3>
            {popTracks.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}

            <h3>Picks for You</h3>
            {picksForYou.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
