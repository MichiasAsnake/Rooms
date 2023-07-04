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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Join Room</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
