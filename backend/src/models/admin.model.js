import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    Refreshtoken: {
        type: String,
    },
});

// No need to hash the password in pre-save hook since you're manually hashing in sign-up.
// Removing the pre-save hook for hashing password.

adminSchema.methods.isPasswordCorrect = async function (password) {
    // Compare plain password with hashed password in DB
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id },
        "your-very-strong-access-token-secret", // Replace with a strong key
        { expiresIn: "15m" } // Set expiration
    );
};

// Generate Refresh Token
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        "your-very-strong-refresh-token-secret", // Replace with a strong key
        { expiresIn: "7d" } // Set expiration
    );
};

const admin = mongoose.model("admin", adminSchema);

export {admin}