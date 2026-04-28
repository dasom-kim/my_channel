import React, { useState, useEffect } from 'react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  isChangingChannel: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, isChangingChannel }) => {
  const [showStatic, setShowStatic] = useState(false);

  useEffect(() => {
    if (isChangingChannel) {
      setShowStatic(true);
      const timer = setTimeout(() => setShowStatic(false), 400); // Static duration
      return () => clearTimeout(timer);
    }
  }, [isChangingChannel, channel.id]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* Simulated Video Content */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url(${channel.currentProgram.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: channel.isThirdParty ? 'brightness(0.8) contrast(1.1)' : 'none' // Slight visual difference for cams
        }}
      >
        {/* Subtle vignette for TV look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        
        {/* Live indicator for 3rd party cams */}
        {channel.isThirdParty && (
          <div className="absolute top-8 right-8 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium tracking-wider text-white/90 uppercase">Live Cam</span>
          </div>
        )}
      </div>

      {/* TV Static Effect during channel change */}
      {showStatic && (
        <div className="absolute inset-0 tv-static z-10" />
      )}
    </div>
  );
};
