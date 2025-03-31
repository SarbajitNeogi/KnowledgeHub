import mongoose from "mongoose";

const db = async () => {
  try {
    const MONGODB_URL = "mongodb://localhost:27017/eLearning"; // Directly set MongoDB URL
    const connectionInstance = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default db;
