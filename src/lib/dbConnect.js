import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in the .env file");
}

/** Global is used here to maintain a cached connection across hot reloads in development */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        console.log("Using existing database connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("🛠️ Creating new database connection...");
        cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
