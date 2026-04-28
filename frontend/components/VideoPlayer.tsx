import React, { useEffect, useRef } from 'react';
import { Channel } from '../types';
import { parseYouTubeUrl } from '../utils/youtube';

interface VideoPlayerProps {
  channel: Channel;
  isChangingChannel: boolean;
  onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, isChangingChannel, onVideoEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeVideo = !channel.isThirdParty ? parseYouTubeUrl(channel.currentProgram.videoUrl) : null;
  const isMp4Video = channel.currentProgram.videoUrl.endsWith('.mp4');
  const fallbackThumbnail = youtubeVideo?.thumbnailUrl ?? channel.currentProgram.thumbnail;

  // Effect for robust MP4 video playback
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isMp4Video) return;

    const playVideo = () => {
      videoElement.play().catch(error => {
        console.error("Video playback was prevented by the browser:", error);
      });
    };

    videoElement.load();
    videoElement.addEventListener('canplay', playVideo);

    if (onVideoEnd) {
      videoElement.addEventListener('ended', onVideoEnd);
    }

    return () => {
      videoElement.removeEventListener('canplay', playVideo);
      if (onVideoEnd) {
        videoElement.removeEventListener('ended', onVideoEnd);
      }
    };
  }, [channel.id, onVideoEnd, isMp4Video]);

  const renderPlayer = () => {
    if (isMp4Video) {
      return (
        <video
          ref={videoRef}
          key={channel.id}
          src={channel.currentProgram.videoUrl}
          muted
          playsInline
          loop={channel.isThirdParty} // Loop for live cams, not for VODs
          className={`w-full h-full object-cover transition-opacity duration-300 ${isChangingChannel ? 'opacity-0' : 'opacity-100'}`}
        />
      );
    }

    if (youtubeVideo) {
      return (
        <iframe
          key={channel.id}
          src={youtubeVideo.embedUrl}
          title={channel.currentProgram.title}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${isChangingChannel ? 'opacity-0' : 'opacity-100'}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      );
    }

    // Fallback to thumbnail
    return (
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isChangingChannel ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url(${fallbackThumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {renderPlayer()}
      {isChangingChannel && (
        <div className="absolute inset-0 tv-static z-10" />
      )}
    </div>
  );
};
