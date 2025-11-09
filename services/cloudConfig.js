import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.CLOUD_NAME);
cloudinary.config({
  cloud_name: "daxa01n9n",
  api_key: "879369746663175",
  api_secret: "9qxdvjM_Rad25XTutQiqdEmmsDA",
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust", // The name of the folder in cloudinary
    allowerdformat: ["png", "jpeg", "jpg"], // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

export default cloudinary;
