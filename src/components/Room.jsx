import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import ReactPlayer from "react-player";
import socket from "./socket";
import Chat from "./Chat";
import { useRoomState } from "./roomstate";
import Navigation from "./Navigation";
import { store } from "./firebase";
import JoinRoom from "./JoinRoom";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const { roomId } = useParams();
  const { roomState, updateRoomState } = useRoomState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [username, setUsername] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [showJoinRoom, setShowJoinRoom] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isRoomPasswordSet, setIsRoomPasswordSet] = useState(false);
  const [roomData, setRoomData] = useState(null); // Add roomData state

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomDoc = await store.collection("rooms").doc(roomId).get();
        const roomData = roomDoc.data();
        setRoomData(roomData); // Set the roomData state
        setProfilePictureUrl(roomData.profilePictureUrl);
        setUsername(roomData.username);
        setRoomDescription(roomData.roomDescription);
        setIsRoomPasswordSet(!!roomData.password); // Check if room password is set
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    const checkIfNewUser = async () => {
      try {
        const roomDoc = await store.collection("rooms").doc(roomId).get();
        const roomData = roomDoc.data();
        const newUser = !roomData || !roomData.username || !roomData.password;
        setIsNewUser(newUser);
      } catch (error) {
        console.error("Error checking if new user:", error);
      }
    };

    fetchRoomData();
    checkIfNewUser();
  }, [roomId]);

  const handleVideoSubmit = (e) => {
    e.preventDefault();

    if (!isUrlSupported(videoUrl)) {
      setValidationError("Unsupported URL. Please enter a valid video URL.");
      return;
    }

    console.log("Setting video URL:", videoUrl);

    socket.emit("setVideoUrl", { roomId, videoUrl });
  };

  const isUrlSupported = (url) => {
    const supportedHosts = [
      "www.youtube.com",
      "www.twitch.tv",
      "player.vimeo.com",
      "soundcloud.com",
      "www.facebook.com",
      "www.wistia.com",
      "www.dailymotion.com",
      "www.mixcloud.com",
      "*.vidyard.com",
    ];

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      for (let i = 0; i < supportedHosts.length; i++) {
        const supportedHost = supportedHosts[i];
        if (supportedHost.startsWith("*")) {
          const domain = supportedHost.replace("*.", "");
          if (hostname.endsWith(domain)) {
            return true;
          }
        } else if (hostname === supportedHost) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", { roomId });
    }

    socket.on("currentVideo", (newState) => {
      updateRoomState(newState);
    });

    if (roomState.isSubmitted && roomState.videoUrl) {
      socket.emit("currentVideo", roomState);
    }

    return () => {
      socket.off("currentVideo");
    };
  }, [roomId]);

  const handleJoinRoom = (roomId, username) => {
    // Perform any necessary operations to join the room
    // Remove the modal
    socket.emit("joinRoom", { roomId, username });

    setShowJoinRoom(false);

    // Make the page accessible
    setIsSubmitted(true);

    setUsername(username);
  };

  return (
    <div>
      <Navigation
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        handleVideoSubmit={handleVideoSubmit}
      />
      <div className="flex w-[100%] h-[100%]  overflow-hidden">
        <div
          className="flex justify-center pr-4 w-full h-[1000px] box-content overflow-hidden bg-slate-600"
          style={{
            maxHeight: "100%",
            overflowY: "scroll",
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent", // Hide scrollbar
          }}
        >
          <div className="flex justify-center pr-4 w-full h-[1000px] box-content overflow-hidden bg-slate-600">
            <div>
              {username && !isSubmitted && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                  <JoinRoom
                    roomId={roomId}
                    roomPassword={roomData?.password}
                    handleJoinRoom={handleJoinRoom}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            {validationError && <p>{validationError}</p>}
            {roomState.isSubmitted && !validationError && roomState.videoUrl ? (
              <ReactPlayer
                url={roomState.videoUrl}
                playing={roomState.isPlaying}
                progressInterval={10}
                width={"980px"}
                height={"550px"}
                onPlay={() => socket && socket.emit("playVideo", { roomId })}
                onPause={() => socket && socket.emit("pauseVideo", { roomId })}
                onProgress={(e) => {
                  const { played, loaded } = e;
                  const duration = loaded ? loaded : 0;
                  const seekTime = played * duration;

                  socket &&
                    socket.emit("seekVideo", { roomId, time: seekTime });
                }}
              />
            ) : (
              <div className="border-4 bg-slate-200 w-[980px] h-[550px] p-4"></div>
            )}
            <div className="flex">
              <div className="flex items-center mt-4">
                <img
                  src={profilePictureUrl}
                  alt="Profile Picture"
                  className="w-[73px] h-[73px] rounded-full mr-2"
                />
              </div>
              <div className="flex flex-col p-2 mt-4">
                <span className="text-lg font-semibold">{username}</span>
                <div>{roomDescription}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex bg-blue-400 absolute right-[1px]"
          style={{ position: "sticky", top: "0" }}
        >
          <Chat roomId={roomId} username={username} />
        </div>
      </div>
    </div>
  );
};

export default Room;
