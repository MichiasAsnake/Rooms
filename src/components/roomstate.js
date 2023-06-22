import { useState } from "react";

const initialRoomState = {
  videoUrl: "",
  isPlaying: false,
  seekTime: 0,
  isSubmitted: false,
};

export const useRoomState = () => {
  const [roomState, setRoomState] = useState(initialRoomState);

  const updateRoomState = (newState) => {
    setRoomState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return {
    roomState,
    updateRoomState,
  };
};
