import mongoose from "mongoose";

export async function connectDb() {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://CodeAlphaTaso:Vibhu30@codealphatasks.v4ial.mongodb.net/EduVerse"
    );
    console.log("Connected to MongoDB:", connection.connection.host);
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
