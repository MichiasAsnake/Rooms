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

const Room = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const { roomId } = useParams();
  const { roomState, updateRoomState } = useRoomState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [username, setUsername] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [showJoinRoom, setShowJoinRoom] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isRoomPasswordSet, setIsRoomPasswordSet] = useState(false);

  useEffect(() => {
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

    socket.on("videoUrlUpdated", (newVideoUrl, isSubmitted) => {
      updateRoomState({
        videoUrl: newVideoUrl,
        isSubmitted,
      });
    });

    return () => {
      socket.off("currentVideo");
      socket.off("videoUrlUpdated");
    };
  }, [roomId]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomDoc = await store.collection("rooms").doc(roomId).get();
        const roomData = roomDoc.data();
        setProfilePictureUrl(roomData.profilePictureUrl);
        setUsername(roomData.username);
        setRoomDescription(roomData.roomDescription);
        setIsRoomPasswordSet(!!roomData.password); // Check if room password is set
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleJoinRoom = () => {
    setIsSubmitted(true);
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
          <div>
            {isRoomPasswordSet && !isSubmitted && (
              <JoinRoom roomId={roomId} handleJoinRoom={handleJoinRoom} />
            )}
          </div>
          <div className="p-4">
            {validationError && <p>{validationError}</p>}
            {isSubmitted && !validationError ? (
              <ReactPlayer
                url={roomState.videoUrl}
                playing={roomState.isPlaying}
                progressInterval={10}
                width={"980px"}
                height={"550px"}
                onPlay={() => socket && socket.emit("playVideo", { roomId })}
                onPause={() => socket && socket.emit("pauseVideo", { roomId })}
                onProgress={(e) =>
                  socket &&
                  socket.emit("seekVideo", { roomId, time: e.playedSeconds })
                }
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
