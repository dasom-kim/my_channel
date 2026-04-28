import React, { useState, useEffect, useRef } from 'react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  isChangingChannel: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, isChangingChannel }) => {
  const [showStatic, setShowStatic] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isChangingChannel) {
      setShowStatic(true);
      const timer = setTimeout(() => setShowStatic(false), 400); // Static duration
      return () => clearTimeout(timer);
    }
  }, [isChangingChannel, channel.id]);

  // Explicitly play the video when it becomes visible
  useEffect(() => {
    if (channel.isThirdParty && !showStatic && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Video autoplay failed, trying to play manually:", error);
      });
    }
  }, [channel, showStatic]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {channel.isThirdParty ? (
        <video
          ref={videoRef}
          key={channel.id}
          src={channel.currentProgram.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${channel.currentProgram.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle vignette for TV look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </div>
      )}

      {/* TV Static Effect during channel change */}
      {showStatic && (
        <div className="absolute inset-0 tv-static z-10" />
      )}
    </div>
  );
};
