import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
const { MONGODB_URI, MONGODB_DB } = process.env;

async function dbConnect(): Promise<void> {
  // Check if already connected (readyState 1 = connected)
  if (connection.isConnected === 1) {
    console.log("Using existing connection");
    return;
  }

  // Check if mongoose is already connected
  if (mongoose.connection.readyState === 1) {
    connection.isConnected = 1;
    console.log("Using existing mongoose connection");
    return;
  }

  // If connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log("Connection in progress, waiting...");
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    connection.isConnected = 1;
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
