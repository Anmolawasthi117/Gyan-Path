import { server } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import logger from "./utils/logger.js";

dotenv.config({ path: "./src/.env" });

const PORT = process.env.PORT || 3000;

// Start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}.....`);
      logger.info(`Server is running on http://localhost:${PORT}.....`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error", err);
  });