import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {student} from "../models/student.model.js";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = "your-very-strong-access-token-secret";

const authSTD = asyncHandler(async (req, res, next) => {
    try {
        const accessToken = req.cookies?.Accesstoken;

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request: No access token provided");
        }

        // Verify JWT token using the hardcoded secret
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        if (!decodedToken || !decodedToken._id) {
            throw new ApiError(401, "Unauthorized request: Invalid token");
        }

        // Fetch student details, excluding sensitive fields
        const Student = await student.findById(decodedToken._id).select("-Password -Refreshtoken");

        if (!Student) {
            throw new ApiError(401, "Unauthorized request: Student not found");
        }

        req.Student = Student;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized request: " + error.message);
    }
});

export { authSTD };