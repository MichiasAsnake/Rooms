import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "./firebase";

const JoinRoomPage = () => {
  const { roomId } = useParams();
  const history = useNavigate();
  const [roomData, setRoomData] = React.useState(null);
  const [password, setPassword] = React.useState("");
  const [validationError, setValidationError] = React.useState("");

  React.useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRef = await store.collection("rooms").doc(roomId).get();

        if (roomRef.exists) {
          const data = roomRef.data();
          setRoomData(data);
        } else {
          // Room not found
          history.replace("/"); // Redirect to a home page or show an error message
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId, history]);

  const handleJoinRoom = (e) => {
    e.preventDefault();

    if (roomData.password && password !== roomData.password) {
      setValidationError("Incorrect password");
      return;
    }

    // Perform the action to join the room
    // Redirect or execute the necessary logic

    // Example: Redirect to the room component
    history(`/rooms/${roomData.name}/${roomId}`);
  };

  if (!roomData) {
    // Render a loading state or placeholder while room data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="w-96 m-auto">
      {roomData.password ? (
        <form
          onSubmit={handleJoinRoom}
          className="flex flex-col w-80 justify-center items-center h-96 space-y-4"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {validationError && <p>{validationError}</p>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Join Room
          </button>
        </form>
      ) : (
        <p>This room does not require a password.</p>
        // Render alternative content if desired, such as a countdown or waiting message
      )}
    </div>
  );
};

export default JoinRoomPage;
