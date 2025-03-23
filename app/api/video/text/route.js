import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Extract the YouTube video ID from the URL
    const videoId = videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();

    // Fetch the transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return NextResponse.json({ success: true, transcript }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
