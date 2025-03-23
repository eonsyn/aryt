import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import axios from "axios";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Make sure this matches .env.local
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
const execPromise = promisify(exec);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Extract the direct MP4 URL using yt-dlp
    const { stdout } = await execPromise(`yt-dlp -f mp4 --get-url "${videoUrl}"`);
    const directVideoUrl = stdout.trim();
    console.log("Direct Video URL:", directVideoUrl);

    // Download video into buffer
    const videoResponse = await axios.get(directVideoUrl, {
      responseType: "arraybuffer",
      timeout: 30000, // 30s timeout
    });

    const videoBuffer = Buffer.from(videoResponse.data);
    console.log("Video downloaded to buffer.");

    // Upload video to Cloudinary using a Promise
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "video", invalidate: true },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(videoBuffer);
      });

    const uploadResponse = await uploadToCloudinary();

    return NextResponse.json({ success: true,  url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
