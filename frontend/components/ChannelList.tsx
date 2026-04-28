import React, { useState } from 'react';
import { Channel } from '../types';
import { List, ChevronRight, RefreshCw, ChevronLeft } from 'lucide-react';

interface ChannelListProps {
  channels: Channel[];
  currentChannelId: string;
  onSelectChannel: (id: string) => void;
  lastSyncTime: Date | null;
  onSync: () => void;
}

const formatTime = (date: Date | null) => {
  if (!date) return 'N/A';
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

export const ChannelList: React.FC<ChannelListProps> = ({ 
  channels, 
  currentChannelId, 
  onSelectChannel,
  lastSyncTime,
  onSync
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    onSync();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full transition-all duration-300 ease-in-out hover:bg-blue-600 ${
          isOpen ? 'left-[21rem]' : 'left-4' // Adjusted left position for open state
        }`}
        title={isOpen ? "채널 목록 닫기" : "채널 목록 열기"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar Panel */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0 z-50' : '-translate-x-full z-20'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <List size={24} className="text-white/70" />
            <h2 className="text-xl font-semibold tracking-wide">채널 목록</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">
              {formatTime(lastSyncTime)}
            </span>
            <button onClick={handleSync} disabled={isSyncing} title="채널 목록 새로고침">
              <RefreshCw size={16} className={`text-white/60 hover:text-white transition-colors ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {channels.map(channel => {
            const isActive = channel.id === currentChannelId;
            return (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
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
    </>
  );
};
