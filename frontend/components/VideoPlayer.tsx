import React, { useEffect, useRef } from 'react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  isChangingChannel: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, isChangingChannel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // This effect handles the core playback logic.
  // It runs whenever the channel ID changes.
  useEffect(() => {
    const videoElement = videoRef.current;
    // Exit if this is not a video channel
    if (!videoElement || !channel.isThirdParty) return;

    // This is the function that will be called when the video is ready
    const playVideo = () => {
      videoElement.play().catch(error => {
        console.error("Video playback was prevented by the browser:", error);
      });
    };

    // When the channel changes, we explicitly tell the video element to load the new source.
    videoElement.load();
    
    // We then listen for the 'canplay' event. The browser fires this event
    // when it has downloaded enough data to begin playback.
    videoElement.addEventListener('canplay', playVideo);

    // Cleanup function: It's crucial to remove the event listener when the
    // component re-renders for a new channel, to avoid multiple listeners.
    return () => {
      videoElement.removeEventListener('canplay', playVideo);
    };
  }, [channel.id]); // The dependency array ensures this logic runs on every channel change.

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {channel.isThirdParty ? (
        <video
          ref={videoRef}
          key={channel.id} // This is crucial: it forces a re-mount on channel change
          src={channel.currentProgram.videoUrl}
          // autoPlay is removed to give full, reliable control to our useEffect
          loop
          muted
          playsInline
          // The transition is now simpler, directly tied to the isChangingChannel prop
          className={`w-full h-full object-cover transition-opacity duration-300 ${isChangingChannel ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${isChangingChannel ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${channel.currentProgram.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </div>
      )}

      {/* TV Static Effect during channel change */}
      {isChangingChannel && (
        <div className="absolute inset-0 tv-static z-10" />
      )}
    </div>
  );
};
