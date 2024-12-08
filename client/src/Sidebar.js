import React, { useState, useEffect } from "react";
import { FaHome, FaSearch, FaMusic } from "react-icons/fa";
import axios from "axios";
import sidecss from "./styles/Sidebar.module.css";

const Sidebar = ({ accessToken, chooseTrack }) => {
  const [recentTracks, setRecentTracks] = useState([]);

  const fetchRecentlyPlayed = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 20,
        },
      });

      const uniqueTracks = response.data.items.reduce((unique, item) => {
        if (!unique.some((track) => track.id === item.track.id)) {
          unique.push(item.track);
        }
        return unique;
      }, []);

      setRecentTracks(uniqueTracks);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchRecentlyPlayed();
  }, [accessToken]);

  return (
    <div className={sidecss.sidebar}>
      <div className={sidecss.sidebarheader}>
        <h2>Recently Played Tracks</h2>
      </div>
      <ul className={sidecss.menu}>
        {/* Render Recently Played Tracks */}
        <div className={sidecss.recentlyPlayed}>
          {recentTracks.map((track, index) => (
            <div
              key={index}
              className={sidecss.trackItem}
              onClick={() => chooseTrack({
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: track.album.images[0]?.url,
              })}
              style={{ cursor: "pointer", textAlign: "center", marginBottom: "15px" }}
            >
              {/* Album Image */}
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                width="60"
                height="60"
                style={{ borderRadius: "50%" }}
              />
              {/* Song Name */}
              <p style={{ marginTop: "5px", fontSize: "12px", color: "#fff", wordWrap: "break-word" }}>
                {track.name}
              </p>
            </div>
          ))}
        </div>
      </ul>
      <div className={sidecss.sidebarfooter}>
        <p>&copy; 2024 HuuCoder</p>
      </div>
    </div>
  );
};

export default Sidebar;
