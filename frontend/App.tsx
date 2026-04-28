import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Channel, UserPreferences, AlertEvent } from './types';
import { MOCK_CHANNELS } from './constants';
import { getRecommendedChannel } from './services/aiService';
import { VideoPlayer } from './components/VideoPlayer';
import { OSD } from './components/OSD';
import { SettingsModal } from './components/SettingsModal';
import { SmartAlertPiP } from './components/SmartAlertPiP';
import { ChannelList } from './components/ChannelList';
import { NavBar, NavTab } from './components/NavBar';
import { AlertTriangle } from 'lucide-react';

const DEFAULT_PREFS: UserPreferences = {
  favoriteGenres: ['음악', '스포츠'],
  autoSwitchToMyChannel: true,
  enableSmartAlerts: true,
  connectedCams: ['tplink'], // Default to having TP-Link connected
  isGoogleConnected: false,
};

export default function App() {
  // State
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFS);
  const [activeTab, setActiveTab] = useState<NavTab>('my-channel');
  const [currentChannelId, setCurrentChannelId] = useState<string>(MOCK_CHANNELS[0].id);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<AlertEvent | null>(null);
  const [isChangingChannel, setIsChangingChannel] = useState<boolean>(false);
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [likedChannels, setLikedChannels] = useState<Set<string>>(new Set());
  const [isAutoAdvanceEnabled, setIsAutoAdvanceEnabled] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const isMyChannelActive = activeTab === 'my-channel';

  // Filter channels based on active tab
  const activeChannels = useMemo(() => {
    const allBroadcast = MOCK_CHANNELS.filter(c => !c.isThirdParty);
    
    if (activeTab === 'live-tv') {
      return allBroadcast.sort((a, b) => a.number - b.number);
    }

    if (activeTab === 'my-channel') {
      const connectedCams = MOCK_CHANNELS.filter(c => 
        c.isThirdParty && c.brandId && preferences.connectedCams.includes(c.brandId)
      );
      
      let filteredBroadcast = allBroadcast;
      if (preferences.favoriteGenres.length > 0) {
        filteredBroadcast = allBroadcast.filter(c => 
          preferences.favoriteGenres.includes(c.currentProgram.genre)
        );
        if (filteredBroadcast.length === 0) {
          filteredBroadcast = allBroadcast;
        }
      }
      return [...filteredBroadcast, ...connectedCams].sort((a, b) => a.number - b.number);
    }

    return allBroadcast.sort((a, b) => a.number - b.number);
  }, [preferences.connectedCams, preferences.favoriteGenres, activeTab]);

  const currentChannel = activeChannels.find(c => c.id === currentChannelId) || activeChannels[0];
  
  const connectedCamChannels = useMemo(() => {
    return MOCK_CHANNELS.filter(c => 
      c.isThirdParty && c.brandId && preferences.connectedCams.includes(c.brandId)
    );
  }, [preferences.connectedCams]);

  const changeChannel = useCallback((newId: string) => {
    if (newId === currentChannelId) return;
    setIsChangingChannel(true);
    setTimeout(() => {
      setCurrentChannelId(newId);
      setIsChangingChannel(false);
    }, 300);
  }, [currentChannelId]);

  useEffect(() => {
    if ((activeTab === 'my-channel' || activeTab === 'live-tv') && !activeChannels.find(c => c.id === currentChannelId)) {
      changeChannel(activeChannels[0].id);
    }
  }, [activeChannels, currentChannelId, changeChannel, activeTab]);

  // AI Recommendation Logic
  const applyMyChannelRecommendation = useCallback(async (isManualSync: boolean = false) => {
    if (!isMyChannelActive) return;
    
    if(isManualSync) console.log('Syncing channels with TV Plus server...');
    
    const { channelId, reason } = await getRecommendedChannel(activeChannels, preferences);
    setRecommendationReason(reason);
    setLastSyncTime(new Date());
    
    if (channelId !== currentChannelId) {
      changeChannel(channelId);
    }
  }, [isMyChannelActive, preferences, currentChannelId, changeChannel, activeChannels]);

  // Initial recommendation when entering My Channel
  useEffect(() => {
    if (isMyChannelActive) {
      applyMyChannelRecommendation();
    } else {
      setRecommendationReason('');
    }
  }, [preferences, isMyChannelActive]);

  // 15-second auto-advance timer effect
  useEffect(() => {
    if (!isAutoAdvanceEnabled || currentChannel.isThirdParty) {
      return;
    }

    // Create a list of only non-live channels to cycle through
    const shuffleableChannels = activeChannels.filter(c => !c.isThirdParty);
    if (shuffleableChannels.length < 2) return; // Not enough channels to shuffle

    const advanceInterval = setInterval(() => {
      const currentIndex = shuffleableChannels.findIndex(c => c.id === currentChannelId);
      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % shuffleableChannels.length;
        changeChannel(shuffleableChannels[nextIndex].id);
      } else {
        // If current channel is not in the shuffle list (e.g., a live cam), start from the first shuffleable channel
        changeChannel(shuffleableChannels[0].id);
      }
    }, 15000);

    return () => clearInterval(advanceInterval);

  }, [isAutoAdvanceEnabled, currentChannel, currentChannelId, activeChannels, changeChannel]);

  const triggerSimulatedAlert = useCallback(() => {
    if (!preferences.enableSmartAlerts || connectedCamChannels.length === 0) return;
    
    const randomCam = connectedCamChannels[Math.floor(Math.random() * connectedCamChannels.length)];
    const newAlert: AlertEvent = {
      id: Date.now().toString(),
      type: 'sound',
      message: `${randomCam.name}에서 움직임이 감지되었습니다.`,
      channelId: randomCam.id,
      timestamp: new Date(),
      severity: 'high'
    };
    setActiveAlert(newAlert);
  }, [preferences.enableSmartAlerts, connectedCamChannels]);

  const handleAlertButtonClick = () => {
    if (activeAlert) {
      setActiveAlert(null);
    } else {
      triggerSimulatedAlert();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      triggerSimulatedAlert();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [triggerSimulatedAlert]);

  const toggleLike = useCallback((channelId: string) => {
    setLikedChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) newSet.delete(channelId);
      else newSet.add(channelId);
      return newSet;
    });
  }, []);

  const renderMainContent = () => {
    if (activeTab === 'my-channel' || activeTab === 'live-tv') {
      return (
        <>
          <VideoPlayer 
            channel={currentChannel} 
            isChangingChannel={isChangingChannel}
          />
          <OSD 
            currentChannel={currentChannel}
            preferences={preferences}
            isMyChannelActive={isMyChannelActive}
            recommendationReason={recommendationReason}
            likedChannels={likedChannels}
            onToggleLike={toggleLike}
            isAutoAdvanceEnabled={isAutoAdvanceEnabled}
            onToggleAutoAdvance={() => setIsAutoAdvanceEnabled(!isAutoAdvanceEnabled)}
          />
          <ChannelList 
            channels={activeChannels}
            currentChannelId={currentChannelId}
            onSelectChannel={changeChannel}
            lastSyncTime={lastSyncTime}
            onSync={() => applyMyChannelRecommendation(true)}
          />
        </>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">
          {activeTab === 'home' ? '홈' : '기타 메뉴'}
        </h1>
        <p className="text-gray-400">이 메뉴는 데모 버전에서 제공되지 않습니다.</p>
        <button 
          onClick={() => setActiveTab('my-channel')}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition-colors"
        >
          마이 채널로 돌아가기
        </button>
      </div>
    );
  };

  return (
    <div className="flex w-full h-full bg-black font-sans overflow-hidden">
      <NavBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
      <div className="flex-1 relative">
        {renderMainContent()}

        <SmartAlertPiP 
          alert={activeAlert}
          camChannel={activeAlert ? MOCK_CHANNELS.find(c => c.id === activeAlert.channelId) : undefined}
          onAccept={(id) => {
            setActiveTab('my-channel');
            changeChannel(id);
            setActiveAlert(null);
          }}
          onDismiss={() => setActiveAlert(null)}
        />
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          preferences={preferences}
          onUpdatePreferences={setPreferences}
        />
        {preferences.enableSmartAlerts && (
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button 
              onClick={handleAlertButtonClick}
              disabled={connectedCamChannels.length === 0}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed ${
                activeAlert 
                  ? 'bg-red-600/80 text-white hover:bg-red-500' 
                  : 'bg-black/50 text-white/60 hover:bg-white/20'
              }`}
              title={connectedCamChannels.length === 0 ? "카메라를 먼저 연결하세요" : "홈캠 알림 시뮬레이션"}
            >
              <AlertTriangle size={14} />
              알림
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
