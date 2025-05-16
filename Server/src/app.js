import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import mapRouter from "./routes/map.routes.js";
import authRouter from "./routes/auth.routes.js";
import { Server } from "socket.io";
import http from "http";
import initializeSocket from "./utils/socket.js";

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

// Initialize Socket.IO logic
initializeSocket(io);

const morganFormat = ":method :url :status :response-time ms";

// Common Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello Gyan Path");
  logger.info("Hello Gyan Path");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/map", mapRouter);

export { app, server };