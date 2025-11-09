import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aadhaarRoutes from "./routes/aadhaarRoutes.js";
import availableProperty from "./routes/availableProperty.js";
import propertiesRequest from "./routes/propertiesRequest.js";
import user from "./routes/user.js";
import mongoose from "mongoose";
import axios from "axios";
import multer from "multer";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins during dev
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
console.log(process.env.ATLASDB_URL);

mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.post("/api/start-video-kyc", (req, res) => {
  const sessionId = uuidv4(); // unique room ID
  res.json({ success: true, sessionId });
});

// Create WebSocket signaling server
const wss = new WebSocketServer({ port: 8080 });
let clients = {};

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        clients[data.sessionId] = clients[data.sessionId] || [];
        clients[data.sessionId].push(ws);
        console.log(`User joined session: ${data.sessionId}`);
        break;

      case "offer":
      case "answer":
      case "candidate":
        // Send WebRTC signaling messages to the other peer
        clients[data.sessionId]
          ?.filter((client) => client !== ws)
          .forEach((client) => client.send(JSON.stringify(data)));
        break;
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});
app.use("/api/", user);
app.use("/api/aadhaar", aadhaarRoutes);
app.use("/api/property", availableProperty);
app.use("/api/request", propertiesRequest);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
