import db from "./database/db.js";
import { app } from "./app.js";

// Connect to MongoDB and start the server
db()
  .then(() => {
    const PORT = 8000; // Hardcoded port
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed!", err);
  });
