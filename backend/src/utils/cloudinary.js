import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"



const CLOUDINARY_NAME = "dcs28lxh7";
const CLOUDINARY_API_KEY = "611585298687662";
const CLOUDINARY_SECRET_KEY = "WCDvNcP9FwRBbxSs3xmudy42OI8";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (err) {
    // Delete the local file if upload fails
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary upload error:", err);
    return null;
  }
};

export { uploadOnCloudinary };