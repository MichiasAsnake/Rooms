import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "./firebase";

const JoinRoom = ({ roomId, roomPassword, handleJoinRoom }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim() === "") {
      setError("Please enter a username.");
      return;
    }

    if (roomPassword && password.trim() === "") {
      setError("Please enter a password.");
      return;
    }

    if (roomPassword && password !== roomPassword) {
      setError("Incorrect password. Please try again.");
      return;
    }

    handleJoinRoom(roomId, roomusername);
  };

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Join Room</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          {roomPassword && (
            <div className="mb-4">
              <label className="block font-medium">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
          )}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Join
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
