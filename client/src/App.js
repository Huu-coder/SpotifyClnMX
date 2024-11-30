import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Library from "./Library"; // Add the Library component
import Explorer from "./Explorer";
import Login from "./Login";
import SpotifyHandler from "./SpotifyHandler";

const App = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(""); // Store access token

  // Load token from localStorage if available
  useEffect(() => {
    const storedToken = localStorage.getItem("spotifyAccessToken");
    if (storedToken) {
      setAccessToken(storedToken); // Set the token if found
    }
  }, []);

  return (
    <Routes>
      {/* Route for SpotifyHandler, used for token exchange */}
      <Route
        path="/SpotifyHandler"
        element={<SpotifyHandler setAccessToken={setAccessToken} />}
      />
      {/* Route for Dashboard, pass the accessToken as a prop */}
      <Route
        path="/Dashboard"
        element={<Dashboard accessToken={accessToken} />}
      />
      {/* Route for Library */}
      <Route path="/Library" element={<Library />} />
      {/* Route for Explorer */}
      <Route path="/Explorer" element={<Explorer />} />
      {/* Route for Login page */}
      <Route path="/Login" element={<Login />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
