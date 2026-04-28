import React from 'react';
import { Search, Home, Sparkles, Tv, Film, Music, Smile, Settings } from 'lucide-react';

export type NavTab = 'search' | 'home' | 'my-channel' | 'live-tv' | 'vod' | 'music' | 'kids';

interface NavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSettings: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange, onOpenSettings }) => {
  const navItems = [
    { id: 'search', icon: Search, label: '검색' },
    { id: 'home', icon: Home, label: '홈' },
    { id: 'my-channel', icon: Sparkles, label: '마이 채널' },
    { id: 'live-tv', icon: Tv, label: '라이브 TV' },
    { id: 'vod', icon: Film, label: '영화/TV' },
    { id: 'music', icon: Music, label: '음악' },
    { id: 'kids', icon: Smile, label: '키즈' },
  ] as const;

  return (
    <div className="w-20 h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col items-center py-6 z-50 shrink-0">
      {/* Samsung TV Plus Logo */}
      <div className="mb-10 cursor-pointer">
        <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="24" fill="#050505"/>
          <rect x="18" y="28" width="54" height="38" rx="10" fill="#1ea0e4"/>
          <rect x="28" y="38" width="54" height="38" rx="10" fill="#f35d2d"/>
          <rect x="28" y="38" width="44" height="28" rx="6" fill="#050505"/>
        </svg>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-6 flex-1 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative group flex justify-center w-full py-2 transition-colors ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
              }`}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
              )}
              <Icon size={24} className={isActive && item.id === 'my-channel' ? 'text-yellow-300 animate-pulse' : ''} />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className="mt-auto text-white/40 hover:text-white/80 transition-colors relative group w-full flex justify-center py-2"
        title="설정"
      >
        <Settings size={24} />
        <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          설정
        </div>
      </button>
    </div>
  );
};
