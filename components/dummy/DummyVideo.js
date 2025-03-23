"use client";
import { motion } from "framer-motion";

export default function SkeletonVideoPlayer() {
  return (
    <div className="flex flex-col items-center justify-center w-screen py-3">
      <div className="h-[60vh] w-[50%] bg-gray-800 rounded-xl relative flex items-center justify-center overflow-hidden">
        
        {/* YouTube-Like Skeleton Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"
        />

        {/* Controls Section (Fade In) */}
        <motion.div
          className="absolute bottom-4 left-4 right-4 flex items-center justify-between   bg-opacity-70 p-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Play/Pause Button */}
          <div className="h-8 w-8 bg-gray-600 rounded-full animate-pulse"></div>

          {/* Seek Bar (Fade In) */}
          <motion.div
            className="flex-1 mx-3 h-1 bg-gray-500 rounded relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute w-[10%] h-1 bg-white rounded animate-pulse"></div>
            <div className="h-3 w-3 bg-white rounded-full absolute left-[10%] top-[-5px] animate-pulse"></div>
          </motion.div>

          {/* Volume Control */}
          <div className="h-6 w-16 bg-gray-600 rounded animate-pulse"></div>

          {/* Fullscreen Button */}
          <div className="h-8 w-8   rounded-full py-1 flex flex-col items-center justify-evenly animate-pulse"> 
<div className="bg-white h-1 w-1 rounded-full animate-pulse"></div>
<div className="bg-white h-1 w-1 rounded-full animate-pulse"></div>
<div className="bg-white h-1 w-1 rounded-full animate-pulse"></div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
