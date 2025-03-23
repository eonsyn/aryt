"use client";
import { useState } from "react";
import DummyVideo from "@/components/dummy/DummyVideo";

export default function Page() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const handleDownload = async () => {
    if (!url) return alert("Please enter a YouTube URL!");

    setLoading(true);
    setDownloadLink("");

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.success && data.url) {
        setDownloadLink(data.url);
        setUrl("");
      } else {
        alert("Download failed: " + data.error);
      }
    } catch (error) {
      alert("Error fetching download: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Force the video to download
  const forceDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">YouTube Video Downloader</h1>

      <div className="flex w-full max-w-md bg-gray-800 rounded-lg p-2 shadow-lg">
        <input
          type="text"
          placeholder="Enter YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-l-lg outline-none text-white"
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-lg disabled:bg-red-400"
        >
          {loading ? "Downloading..." : "Download"}
        </button>
      </div>

      {/* Show Dummy Video While Loading */}
      {loading ? (
        <DummyVideo />
      ) : downloadLink && (
        <div className="mt-6 flex flex-col items-center">
          {/* Video Player */}
          <div className="relative w-full max-w-2xl bg-black rounded-lg shadow-lg overflow-hidden">
            <video
              width="640"
              height="360"
              src={downloadLink}
              controls
              className="w-full h-auto rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Download Button */}
          <button 
            onClick={() => forceDownload(downloadLink)}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all cursor-pointer"
          >
            Click to Download
          </button>
        </div>
      )}
    </div>
  );
}
