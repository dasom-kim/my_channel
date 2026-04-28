import React, { useEffect, useState } from 'react';
import { Channel, UserPreferences } from '../types';
import { Sparkles } from 'lucide-react';

interface OSDProps {
  currentChannel: Channel;
  preferences: UserPreferences;
  isMyChannelActive: boolean;
  recommendationReason?: string;
}

export const OSD: React.FC<OSDProps> = ({ 
  currentChannel, 
  preferences, 
  isMyChannelActive, 
  recommendationReason
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide OSD after a few seconds of inactivity
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [currentChannel.id, isMyChannelActive]);

  // Show OSD on mouse move
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="max-w-4xl">
          <div className="flex items-end gap-6 mb-4">
            <div className="text-6xl font-bold text-white/90 drop-shadow-lg">
              {currentChannel.number}
            </div>
            <div className="pb-1">
              <h1 className="text-4xl font-semibold drop-shadow-md text-white">{currentChannel.name}</h1>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-blue-600/80 rounded text-xs font-bold uppercase tracking-wider text-white">
                {currentChannel.currentProgram.genre}
              </span>
              {currentChannel.isThirdParty ? (
                <div className="flex items-center gap-1.5 text-red-400">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-bold tracking-wider uppercase">LIVE</span>
                </div>
              ) : (
                <span className="text-white/60 text-sm font-medium">
                  {currentChannel.currentProgram.startTime} - {currentChannel.currentProgram.endTime}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-medium mb-2 text-white">{currentChannel.currentProgram.title}</h2>
            <p className="text-white/70 text-lg line-clamp-2">{currentChannel.currentProgram.description}</p>
            
            {/* AI Recommendation Reason */}
            {isMyChannelActive && recommendationReason && !currentChannel.isThirdParty && (
              <div className="mt-4 flex items-start gap-2 text-blue-300 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                <Sparkles size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  <span className="font-bold text-blue-200">AI 추천: </span>
                  {recommendationReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
