const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  console.log(" Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Frontend disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };
