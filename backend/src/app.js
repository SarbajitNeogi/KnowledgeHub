import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // ✅ Frontend URL
    credentials: true, // ✅ Required for cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"], // ✅ Explicitly allow auth headers
    exposedHeaders: ["Authorization"], // ✅ Ensures frontend can read the token
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Set Razorpay credentials
export const instance = new Razorpay({
    key_id: "your_razorpay_key", // Replace with actual key
    key_secret: "your_razorpay_secret", // Replace with actual secret
});

// Import Routes
import studentRouter from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js";
import courseRouter from "./routes/course.routes.js";
import adminRouter from "./routes/admin.routes.js";
import paymentRouter from "./routes/payment.routes.js";

// Use Routes
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/course", courseRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

export { app };
