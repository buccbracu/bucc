import mongoose from "mongoose";
require("dotenv").config();

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

  try {
    const db = await mongoose.connect(MONGODB_URI!, {
      dbName: MONGODB_DB,
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("New connection created");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect;
