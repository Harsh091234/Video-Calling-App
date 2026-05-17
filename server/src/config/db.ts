import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Wait maximum 10 seconds for connection
    const conn = await Promise.race([
      mongoose.connect(process.env.MONGO_URI as string),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection timeout")),
          10000,
        ),
      ),
    ]);

    console.log(`MongoDB Connected: ${(conn as any).connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);

    // Continue app execution
    console.log("Continuing without database connection...");
  }
};