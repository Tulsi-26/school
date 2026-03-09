"use client";

import React from 'react';

interface VideoInfo {
  title: string;
  videoId: string;
}

const videosByExperiment: Record<string, VideoInfo[]> = {
  'ohm-law': [
    { title: "Ohm's Law Explained", videoId: 'HsLLq6Rm5tU' },
    { title: 'V-I Characteristics', videoId: '8jB6hDUqN0Y' },
  ],
  'wheatstone-bridge': [
    { title: 'Wheatstone Bridge Principle', videoId: 'ubNOcfDXVZw' },
    { title: 'Bridge Balance Condition', videoId: 'pGT8fmqUlWQ' },
  ],
  'reflection-refraction': [
    { title: 'Laws of Reflection', videoId: 'bKuq4UtgJ1c' },
    { title: 'Refraction Through Lenses', videoId: 'dqBBdqdi4CE' },
  ],
  'newton-second-law': [
    { title: "Newton's Second Law (F=ma)", videoId: 'kKKM8Y-u7ds' },
    { title: 'Pulley Systems Explained', videoId: '7HHEX0MiMbg' },
  ],
};

export const YouTubeVideos: React.FC<{ experimentId: string }> = ({ experimentId }) => {
  const videos = videosByExperiment[experimentId] || [];

  if (videos.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5S0 8.7 0 11v1.5c0 2.3.5 4.5.5 4.5a3 3 0 002.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 002.1-2.1s.5-2.2.5-4.5V11c0-2.3-.5-4.5-.5-4.5zM9.5 15.5v-7l6.3 3.5-6.3 3.5z" />
        </svg>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept Videos</span>
      </div>

      <div className="space-y-3">
        {videos.map((video) => (
          <div key={video.videoId} className="rounded-xl overflow-hidden border border-slate-700/50">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-2 bg-slate-800/50">
              <span className="text-[11px] font-bold text-slate-300">{video.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
