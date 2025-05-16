import logger from "./logger.js";

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Handle user position updates
    socket.on("userPosition", (data) => {
      logger.info(`User position received: ${JSON.stringify(data)}`);
      socket.broadcast.emit("userPosition", data); // Broadcast to other clients
    });

    // Handle node updates
    socket.on("nodeUpdate", (updatedNode) => {
      logger.info(`Node update received: ${JSON.stringify(updatedNode)}`);
      io.emit("nodeUpdate", updatedNode); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default initializeSocket;