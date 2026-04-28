import React, { useState } from 'react';
import { Channel } from '../types';
import { List, ChevronRight } from 'lucide-react';

interface ChannelListProps {
  channels: Channel[];
  currentChannelId: string;
  onSelectChannel: (id: string) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({ channels, currentChannelId, onSelectChannel }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Area (Left edge) */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-4 z-30 cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
      />

      {/* Sidebar */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 z-40 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <List size={24} className="text-white/70" />
          <h2 className="text-xl font-semibold tracking-wide">채널 목록</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {channels.map(channel => {
            const isActive = channel.id === currentChannelId;
            return (
              <button
                key={channel.id}
                onClick={() => {
                  onSelectChannel(channel.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-colors relative ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                )}
                <div className={`w-12 text-center font-bold ${isActive ? 'text-blue-400' : 'text-white/50'}`}>
                  {channel.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {channel.name}
                  </div>
                  <div className="text-xs text-white/50 truncate mt-1">
                    {channel.currentProgram.title}
                  </div>
                </div>
                {channel.isThirdParty && (
                  <div className="w-2 h-2 rounded-full bg-red-500" title="라이브" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint Icon when closed */}
      {!isOpen && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/30 pointer-events-none flex flex-col items-center gap-2">
          <ChevronRight size={24} className="animate-pulse" />
        </div>
      )}
    </>
  );
};
