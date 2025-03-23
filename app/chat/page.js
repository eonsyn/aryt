"use client";
import { useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to extract Video ID from YouTube URL
  function extractVideoId(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/))([^?&]+)/);
    return match ? match[1] : null;
  }

  // Handle Fetching Transcript
  const handleFetchTranscript = async () => {
    if (!url) {
      setError("Please enter a valid YouTube URL!");
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Invalid YouTube URL. Try again!");
      return;
    }

    setLoading(true);
    setTranscript(null);
    setError("");

    try {
      const response = await fetch(`/api/video/text?url=https://youtu.be/${videoId}`);
      const data = await response.json();

      if (data.success) {
        setTranscript(data.transcript);
      } else {
        setError("Failed to fetch transcript.");
      }
    } catch (err) {
      setError("Error fetching transcript: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">YouTube Transcript Fetcher</h1>

      {/* Input & Button */}
      <div className="flex w-full max-w-lg bg-gray-800 rounded-lg p-2 shadow-lg">
        <input
          type="text"
          placeholder="Enter YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-l-lg outline-none text-white"
        />
        <button
          onClick={handleFetchTranscript}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:bg-blue-400"
        >
          {loading ? "Fetching..." : "Get Transcript"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Transcript Display */}
      {transcript && (
        <div className="mt-6 w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
          <div className="h-64 overflow-y-auto p-2 bg-gray-900 rounded-md text-sm">
            {transcript.map((line, index) => (
              <p key={index} className="mb-2">{line.text}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
