import cloudinaryLib from "cloudinary";

const cloudinary = cloudinaryLib.v2;

if (typeof window !== "undefined") {
  throw new Error("Cloudinary should only be used on the server side.");
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export default cloudinary;
