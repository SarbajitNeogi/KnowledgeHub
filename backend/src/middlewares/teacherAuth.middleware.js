import { ApiError } from "../utils/ApiError.js";
import {Teacher} from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const ACCESS_TOKEN_SECRET = "your-very-strong-access-token-secret"; // Hardcoded secret

const authTeacher = asyncHandler(async (req, res, next) => {
    try {
        const accToken = req.cookies?.Accesstoken;

        if (!accToken) {
            throw new ApiError(401, "Unauthorized request: No access token provided");
        }

        // Verify JWT token using the hardcoded secret
        const decodedAccToken = jwt.verify(accToken, ACCESS_TOKEN_SECRET);
        if (!decodedAccToken || !decodedAccToken._id) {
            throw new ApiError(401, "Unauthorized request: Invalid token");
        }

        // Fetch teacher details, excluding sensitive fields
        const teacher = await Teacher.findById(decodedAccToken._id).select("-Password -Refreshtoken");

        if (!teacher) {
            throw new ApiError(401, "Unauthorized request: Teacher not found");
        }

        req.teacher = teacher;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized request: " + error.message);
    }
});

export {authTeacher}