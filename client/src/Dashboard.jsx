import { useState, useEffect } from "react";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import "./styles/Dashboard.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const spotifyApi = new SpotifyWebApi({
  clientId: "19cbbf609a00420e9869fe84b33785ea",
});

export default function Dashboard({ code }) {
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  // Fetch lyrics when a track is selected
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
      })
      .catch((err) => console.error("Error fetching lyrics:", err));
  }, [playingTrack]);

  // Set Spotify API access token
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // Fetch recommendations (top tracks) on initial load
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi
      .getMyTopTracks({ limit: 30 })
      .then((res) => {
        setRecommendations(
          res.body.items.map((track) => {
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
          })
        );
      })
      .catch((err) => console.error("Error fetching recommendations:", err));
  }, [accessToken]);

  // Handle search functionality
  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
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
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <div>
      <Navbar />
      <Container
        className="d-flex flex-column py-2 cont-dash"
        style={{ height: "100vh" }}
      >
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Sidebar accessToken={accessToken} chooseTrack={chooseTrack} />
        <div className="mu-container" style={{ overflowY: "auto" }}>
          {/* Conditionally render tracks or lyrics */}
          {search ? (
            searchResults.length > 0 ? (
              searchResults.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseTrack={chooseTrack}
                />
              ))
            ) : (
              <div className="text-center">No results found.</div>
            )
          ) : lyrics ? (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          ) : (
            recommendations.map((track) => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))
          )}
        </div>
        <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </Container>
    </div>
  );
}
