import CreateRoom from "./components/CreateRoom";
import NewRoom from "./components/NewRoom";
import { Routes, Route } from "react-router";
import Room from "./components/Room";
import NewRoomForm from "./components/NewRoomForm";
import JoinRoomPage from "./components/JoinRoomForm";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CreateRoom />}></Route>
        <Route path="newroom" element={<NewRoom />}></Route>
        <Route path="/rooms/:roomName/:roomId" element={<Room />} />
        <Route path="/rooms/:roomId" element={<JoinRoomPage />} />
        <Route exact path="/rooms" element={<NewRoomForm />} />
      </Routes>
    </div>
  );
};

export default App;
