import React, { useEffect, useRef, useState } from 'react';
import { Channel } from '../types';
import { parseYouTubeUrl } from '../utils/youtube';

interface VideoPlayerProps {
  channel: Channel;
  isChangingChannel: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, isChangingChannel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showStatic, setShowStatic] = useState(false);
  const youtubeVideo = !channel.isThirdParty ? parseYouTubeUrl(channel.currentProgram.videoUrl) : null;
  const fallbackThumbnail = youtubeVideo?.thumbnailUrl ?? channel.currentProgram.thumbnail;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !channel.isThirdParty) return;

    const playVideo = () => {
      videoElement.play().catch(error => {
        console.error("Video playback was prevented by the browser:", error);
      });
    };

    videoElement.load();
    videoElement.addEventListener('canplay', playVideo);

    return () => {
      videoElement.removeEventListener('canplay', playVideo);
    };
  }, [channel.id, channel.currentProgram.videoUrl, channel.isThirdParty]);

  useEffect(() => {
    if (isChangingChannel) {
      setShowStatic(true);
    }
  }, [isChangingChannel]);

  useEffect(() => {
    if (!showStatic) {
      return;
    }

    const timer = setTimeout(() => setShowStatic(false), 400);
    return () => clearTimeout(timer);
  }, [channel.id, showStatic]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {channel.isThirdParty ? (
        <video
          ref={videoRef}
          key={channel.id}
          src={channel.currentProgram.videoUrl}
          loop
          muted
          playsInline
          className={`h-full w-full object-cover transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : youtubeVideo ? (
        <iframe
          key={channel.id}
          src={youtubeVideo.embedUrl}
          title={channel.currentProgram.title}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${fallbackThumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: channel.isThirdParty ? 'brightness(0.8) contrast(1.1)' : 'none'
          }}
        >
          {/* Live indicator for 3rd party cams */}
          {channel.isThirdParty && (
            <div className="absolute top-8 right-8 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium tracking-wider text-white/90 uppercase">Live Cam</span>
            </div>
          )}
        </div>
      )}

      {/* Subtle vignette for TV look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* TV Static Effect during channel change */}
      {showStatic && (
        <div className="absolute inset-0 tv-static z-10" />
      )}
    </div>
  );
};
