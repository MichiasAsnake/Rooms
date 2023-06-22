const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const app = express();
app.use(cors());

const server = http.createServer(app);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

const corsOptions = {
  origin: "http://localhost:5173", // Replace with the actual origin of your React application
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

const activeRooms = {}; // Keep track of active rooms and their respective video URLs, playback state, and seek position

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("joinRoom", ({ roomId }) => {
    // Join the specified room
    socket.join(roomId);

    // Create the room if it doesn't exist
    if (activeRooms[roomId]) {
      const { videoUrl, isPlaying, seekTime } = activeRooms[roomId];
      io.to(roomId).emit("currentVideo", { videoUrl, isPlaying, seekTime });
    }
  });

  socket.on("setVideoUrl", ({ roomId, videoUrl }) => {
    // Update the video URL and reset the playback status and seek time for the specified room
    activeRooms[roomId] = {
      videoUrl,
      isPlaying: false,
      seekTime: 0,
      isSubmitted: true,
    };

    // Broadcast the updated video state to all clients in the room

    io.to(roomId).emit("currentVideo", activeRooms[roomId]);
    console.log(activeRooms);
  });

  socket.on("videoUrlUpdated", ({ roomId, newVideoUrl }) => {
    // Update the video URL for the specified room
    if (activeRooms[roomId]) {
      activeRooms[roomId].videoUrl = newVideoUrl;
      const { isPlaying, seekTime } = activeRooms[roomId];
      io.to(roomId).emit("currentVideo", {
        videoUrl: newVideoUrl,
        isPlaying,
        seekTime,
        isSubmitted: true,
      });
      console.log(activeRooms);
    } else {
      console.log(`Room ${roomId} does not exist`);
    }
  });

  socket.on("playVideo", ({ roomId }) => {
    if (activeRooms[roomId]) {
      activeRooms[roomId].isPlaying = true;
      io.to(roomId).emit("currentVideo", activeRooms[roomId]);
      console.log(activeRooms);
    } else {
      console.log(`Room ${roomId} does not exist`);
    }
  });

  socket.on("pauseVideo", ({ roomId }) => {
    if (activeRooms[roomId]) {
      activeRooms[roomId].isPlaying = false;
      io.to(roomId).emit("currentVideo", activeRooms[roomId]);
      console.log(activeRooms);
    } else {
      console.log(`Room ${roomId} does not exist`);
    }
  });

  socket.on("seekVideo", ({ roomId, time }) => {
    if (activeRooms[roomId]) {
      activeRooms[roomId].seekTime = time;
      io.to(roomId).emit("currentVideo", activeRooms[roomId]);
      console.log(activeRooms);
    } else {
      console.log(`Room ${roomId} does not exist`);
    }
  });

  socket.on("chatMessage", async ({ roomId, sender, message }) => {
    try {
      await db.collection("chatMessages").add({
        roomId,
        sender,
        message,
        timestamp: new Date(),
      });

      // Broadcast the chat message to all clients in the room
      io.to(roomId).emit("chatMessage", { sender, message });
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
