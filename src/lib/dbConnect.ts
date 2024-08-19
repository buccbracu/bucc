import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
const { MONGODB_URI, MONGODB_DB } = process.env;

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }

  if (!MONGODB_URI || !MONGODB_DB) {
    console.error(
      "MONGODB_URI and MONGODB_DB must be defined in environment variables.",
    );
    process.exit(1);
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
      maxPoolSize: 500,
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("New connection created");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

// Ensure graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Mongoose connection disconnected due to app termination");
  process.exit(0);
});

export default dbConnect;
