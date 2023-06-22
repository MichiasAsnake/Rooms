import React from "react";
import { v4 as uuidv4 } from "uuid";
import { store, storage } from "./firebase";
import { useNavigate } from "react-router-dom";

const NewRoomForm = () => {
  const [roomName, setRoomName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [roomDescription, setRoomDescription] = React.useState("");
  const [validationError, setValidationError] = React.useState("");
  const [passwordEnabled, setPasswordEnabled] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generateUniqueId = () => {
      return uuidv4();
    };

    if (!roomName) {
      setValidationError("Room name is required.");
      return;
    }

    if (passwordEnabled && password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const roomId = generateUniqueId();
      const roomRef = store.collection("rooms").doc(roomId);

      let profilePictureUrl = null;
      if (profilePicture) {
        const profilePictureRef = storage
          .ref()
          .child(`profilePictures/${roomId}/${profilePicture.name}`);
        await profilePictureRef.put(profilePicture);
        profilePictureUrl = await profilePictureRef.getDownloadURL();
      }

      await roomRef.set({
        roomName: roomName,
        passwordEnabled: passwordEnabled,
        password: passwordEnabled ? password : null,
        roomId: roomId,
        username: username,
        profilePictureUrl: profilePictureUrl,
        roomDescription: roomDescription,
      });

      setRoomName("");
      setUsername("");
      setProfilePicture(null);
      setRoomDescription("");
      setValidationError("");
      setPasswordEnabled(false);
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");

      navigate(`/rooms/${roomName}/${roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="w-96 m-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-80 justify-center items-center h-96 space-y-4"
      >
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />

        <textarea
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          placeholder="Enter room description"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {validationError && <p>{validationError}</p>}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={passwordEnabled}
            onChange={() => setPasswordEnabled(!passwordEnabled)}
            className="form-checkbox"
          />
          <label htmlFor="togglePassword" className="text-gray-700">
            Set Password
          </label>
        </div>

        {passwordEnabled && (
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordError && <p>{passwordError}</p>}
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default NewRoomForm;
