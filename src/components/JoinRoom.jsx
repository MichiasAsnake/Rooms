import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { store } from "./firebase";

const JoinRoom = ({ roomId, handleJoinRoom }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation on username and password

    if (username.trim() === "") {
      setError("Please enter a username.");
      return;
    }

    if (password.trim() === "") {
      setError("Please enter a password.");
      return;
    }

    // Join the room
    handleJoinRoom(roomId, username);
  };

  return (
    <div>
      <h2>Join Room</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default JoinRoom;
