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

  const isMyChannelActive = activeTab === 'my-channel';

  // Filter channels based on active tab
  const activeChannels = useMemo(() => {
    const allBroadcast = MOCK_CHANNELS.filter(c => !c.isThirdParty);
    
    if (activeTab === 'live-tv') {
      // Live TV: Show all broadcast channels, NO 3rd party cameras
      return allBroadcast.sort((a, b) => a.number - b.number);
    }

    if (activeTab === 'my-channel') {
      // My Channel: Show filtered broadcast + connected cameras
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

    // For other tabs, we might not need activeChannels, but return broadcast as fallback
    return allBroadcast.sort((a, b) => a.number - b.number);
  }, [preferences.connectedCams, preferences.favoriteGenres, activeTab]);

  const currentChannel = activeChannels.find(c => c.id === currentChannelId) || activeChannels[0];
  
  // Get all currently connected cam channels for alerts (memoized to prevent infinite loops in useCallback)
  const connectedCamChannels = useMemo(() => {
    return MOCK_CHANNELS.filter(c => 
      c.isThirdParty && c.brandId && preferences.connectedCams.includes(c.brandId)
    );
  }, [preferences.connectedCams]);

  // Handle Channel Change
  const changeChannel = useCallback((newId: string) => {
    if (newId === currentChannelId) return;
    setIsChangingChannel(true);
    setTimeout(() => {
      setCurrentChannelId(newId);
      setIsChangingChannel(false);
    }, 300);
  }, [currentChannelId]);

  // Ensure we don't stay on a disconnected or filtered-out channel when switching tabs
  useEffect(() => {
    if ((activeTab === 'my-channel' || activeTab === 'live-tv') && !activeChannels.find(c => c.id === currentChannelId)) {
      changeChannel(activeChannels[0].id);
    }
  }, [activeChannels, currentChannelId, changeChannel, activeTab]);

  // AI Recommendation Logic (Only runs when entering My Channel)
  const applyMyChannelRecommendation = useCallback(async () => {
    if (!isMyChannelActive) return;
    
    const { channelId, reason } = await getRecommendedChannel(activeChannels, preferences);
    setRecommendationReason(reason);
    
    if (channelId !== currentChannelId) {
      changeChannel(channelId);
    }
  }, [isMyChannelActive, preferences, currentChannelId, changeChannel, activeChannels]);

  // Trigger recommendation when entering My Channel or updating preferences
  useEffect(() => {
    if (isMyChannelActive) {
      applyMyChannelRecommendation();
    } else {
      setRecommendationReason('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, isMyChannelActive]);

  // Simulate Smart Alert
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

  // Auto-trigger alert every 1 minute for demonstration purposes
  useEffect(() => {
    const intervalId = setInterval(() => {
      triggerSimulatedAlert();
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(intervalId);
  }, [triggerSimulatedAlert]);

  // Render main content based on active tab
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
          />
          <ChannelList 
            channels={activeChannels}
            currentChannelId={currentChannelId}
            onSelectChannel={(id) => {
              changeChannel(id);
            }}
          />
        </>
      );
    }

    // Placeholder for other tabs (Home, VOD, etc.)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">
          {activeTab === 'home' ? '홈' : 
           activeTab === 'search' ? '검색' : 
           activeTab === 'vod' ? '영화/TV' : 
           activeTab === 'music' ? '음악' : '키즈'}
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
      
      {/* Left Navigation Bar */}
      <NavBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {renderMainContent()}

        {/* Smart Alert PiP (Global) */}
        <SmartAlertPiP 
          alert={activeAlert}
          camChannel={activeAlert ? MOCK_CHANNELS.find(c => c.id === activeAlert.channelId) : undefined}
          onAccept={(id) => {
            setActiveTab('my-channel'); // Switching to cam implies turning on My Channel features
            changeChannel(id);
            setActiveAlert(null);
          }}
          onDismiss={() => setActiveAlert(null)}
        />

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          preferences={preferences}
          onUpdatePreferences={setPreferences}
        />

        {/* Debug/Demo Controls */}
        {preferences.enableSmartAlerts && (
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button 
              onClick={handleAlertButtonClick}
              disabled={connectedCamChannels.length === 0}
              className="bg-red-600/80 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm"
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
