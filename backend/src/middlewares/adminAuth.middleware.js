import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { admin } from "../models/admin.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const authAdmin = asyncHandler(async (req, _, next) => {
    let accToken = req.cookies?.Accesstoken || req.headers.authorization;

    if (!accToken) {
        throw new ApiError(401, "Unauthorized request - No Token Provided");
    }

    // Extract Bearer Token
    if (accToken.startsWith("Bearer ")) {
        accToken = accToken.split(" ")[1]; // Get only the token part
    }

    try {
        // Verify token
        const decodedAccToken = jwt.verify(
            accToken,
            process.env.JWT_SECRET || "your-very-strong-access-token-secret"
        );

        // Fetch admin without password & refresh token
        const Admin = await admin.findById(decodedAccToken?._id).select("-password -Refreshtoken");

        if (!Admin) {
            throw new ApiError(403, "Forbidden - Invalid access token");
        }

        req.Admin = Admin;
        next();
    } catch (error) {
        throw new ApiError(403, "Forbidden - Invalid Token or Expired");
    }
});

export { authAdmin }