import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`app listing at ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const socketList = [];
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket.on("checkUserExsist", ({ roomId, userName }) => {
    let error = false;
    const clients = io.sockets.adapter.rooms.get(roomId);
    clients &&
      clients.forEach((client) => {
        if (socketList[client].userName === userName) error = true;
      });
    socket.emit("userExsist", { error });
  });

  socket.on("joningRoom", ({ roomId, myName }) => {
    socket.join(roomId);
    socketList[socket.id] = { userName: myName, video: true, audio: true };
    const users = [];
    const clients = io.sockets.adapter.rooms.get(roomId);
    clients.forEach((client) => {
      users.push({ userId: client, info: socketList[client] });
    });
    socket.broadcast.to(roomId).emit("userjoinedRoom", users);
  });

  socket.on("callUser", ({ usertoCall, from, signal }) => {
    socket
      .to(usertoCall)
      .emit("reciveCall", { signal, from, info: socketList[socket.id] });
  });

  socket.on("acceptCall", ({ signal, to }) => {
    socket
      .to(to)
      .emit("callAccepted", {
        signal,
        answerId: socket.id,
        userName: socketList[socket.id].userName,
      });
  });

  socket.on("switchVideoAudio", ({ roomId, target }) => {
    if (target === "video")
      socketList[socket.id].video = !socketList[socket.id].video;
    else socketList[socket.id].audio = !socketList[socket.id].audio;
    socket
      .to(roomId)
      .emit("switched", { userName: socketList[socket.id].userName, target });
  });

  socket.on("sendMessage", ({ name, message, roomId }) => {
    console.log(message);
    socket.broadcast.to(roomId).emit("reciveMessage", { name, message });
  });

  socket.on("leaveRoom", ({ roomId }) => {
    const name = socketList[socket.id].userName;
    delete socketList[socket.id];
    socket.broadcast.to(roomId).emit("leaveCall", { userId: socket.id, name });
    socket.leave(roomId);
  });
});
