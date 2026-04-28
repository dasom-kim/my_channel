import React, { useState } from 'react';
import { UserPreferences, Genre } from '../types';
import { ALL_GENRES, CAM_BRANDS } from '../constants';
import { X, Check, Home, BellRing, Camera, Video, Plus, Trash2, Loader2, PlaySquare } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
}

const getBrandIcon = (iconName: string) => {
  switch(iconName) {
    case 'Home': return <Home size={24} />;
    case 'BellRing': return <BellRing size={24} />;
    case 'Camera': return <Camera size={24} />;
    case 'Video': return <Video size={24} />;
    default: return <Camera size={24} />;
  }
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, preferences, onUpdatePreferences }) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  if (!isOpen) return null;

  const toggleGenre = (genre: Genre) => {
    const current = preferences.favoriteGenres;
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    
    onUpdatePreferences({ ...preferences, favoriteGenres: updated });
  };

  const handleToggleCam = (brandId: string) => {
    const isConnected = preferences.connectedCams.includes(brandId);
    
    if (isConnected) {
      onUpdatePreferences({
        ...preferences,
        connectedCams: preferences.connectedCams.filter(id => id !== brandId)
      });
    } else {
      setConnectingId(brandId);
      setTimeout(() => {
        onUpdatePreferences({
          ...preferences,
          connectedCams: [...preferences.connectedCams, brandId]
        });
        setConnectingId(null);
      }, 1500);
    }
  };

  const handleToggleGoogle = () => {
    if (preferences.isGoogleConnected) {
      // Disconnect and remove the auto-added genre if it was there
      onUpdatePreferences({ 
        ...preferences, 
        isGoogleConnected: false,
        favoriteGenres: preferences.favoriteGenres.filter(g => g !== '연애 프로그램')
      });
    } else {
      setConnectingGoogle(true);
      setTimeout(() => {
        // Connect and auto-add the recommended genre based on YouTube algorithm
        onUpdatePreferences({
          ...preferences,
          isGoogleConnected: true,
          favoriteGenres: Array.from(new Set([...preferences.favoriteGenres, '연애 프로그램']))
        });
        setConnectingGoogle(false);
      }, 1500);
    }
  };

  // Determine which genres to display
  const displayGenres = preferences.isGoogleConnected 
    ? [...ALL_GENRES, '연애 프로그램' as Genre] 
    : ALL_GENRES;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
          <h2 className="text-2xl font-semibold">마이 채널 설정</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Account Integration */}
          <section className="mb-10">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white/90">계정 연동</h3>
              <p className="text-sm text-white/50">구글 계정을 연동하여 유튜브 시청 이력 기반으로 맞춤 취향을 추천받으세요.</p>
            </div>
            <div className="p-4 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${preferences.isGoogleConnected ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70'}`}>
                  <PlaySquare size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-white/90">Google 계정 (YouTube)</h4>
                  <p className="text-xs text-white/50 mt-1">알고리즘 기반 맞춤 장르 추천</p>
                </div>
              </div>
              <button
                onClick={handleToggleGoogle}
                disabled={connectingGoogle}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  preferences.isGoogleConnected
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                } ${connectingGoogle ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {connectingGoogle ? (
                  <><Loader2 size={16} className="animate-spin" /> 연결 중...</>
                ) : preferences.isGoogleConnected ? (
                  '연동 해제'
                ) : (
                  '연동하기'
                )}
              </button>
            </div>
          </section>

          {/* Taste Profile */}
          <section className="mb-10">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white/90">취향 프로필</h3>
              <p className="text-sm text-white/50">선호하는 장르를 선택하면 AI가 '마이 채널'을 큐레이션 해드립니다.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {displayGenres.map(genre => {
                const isSelected = preferences.favoriteGenres.includes(genre);
                const isRecommended = preferences.isGoogleConnected && genre === '연애 프로그램';
                
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {genre}
                    {isRecommended && (
                      <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        추천
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Connected Devices */}
          <section className="mb-10">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white/90">연결된 카메라</h3>
              <p className="text-sm text-white/50">외부 카메라를 연결하여 채널로 시청하고 스마트 알림을 받으세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAM_BRANDS.map(brand => {
                const isConnected = preferences.connectedCams.includes(brand.id);
                const isConnecting = connectingId === brand.id;

                return (
                  <div key={brand.id} className={`p-4 rounded-xl border transition-all duration-300 flex flex-col gap-4 ${
                    isConnected ? 'bg-blue-900/20 border-blue-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${isConnected ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'}`}>
                        {getBrandIcon(brand.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white/90">{brand.name}</h4>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">{brand.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-auto">
                      <button
                        onClick={() => handleToggleCam(brand.id)}
                        disabled={isConnecting}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                          isConnected 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isConnecting ? (
                          <><Loader2 size={16} className="animate-spin" /> 연결 중...</>
                        ) : isConnected ? (
                          <><Trash2 size={16} /> 해제</>
                        ) : (
                          <><Plus size={16} /> 연결</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Smart Features */}
          <section>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white/90">스마트 기능</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <div className="font-medium">마이 채널 자동 전환</div>
                  <div className="text-sm text-white/50 mt-1">TV를 켤 때 큐레이션된 채널로 자동 전환합니다.</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${preferences.autoSwitchToMyChannel ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.autoSwitchToMyChannel ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={preferences.autoSwitchToMyChannel}
                  onChange={(e) => onUpdatePreferences({ ...preferences, autoSwitchToMyChannel: e.target.checked })}
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <div className="font-medium">스마트 알림 (홈캠)</div>
                  <div className="text-sm text-white/50 mt-1">연결된 카메라에서 활동이 감지되면 화면에 알림(PiP)을 표시합니다.</div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${preferences.enableSmartAlerts ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.enableSmartAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={preferences.enableSmartAlerts}
                  onChange={(e) => onUpdatePreferences({ ...preferences, enableSmartAlerts: e.target.checked })}
                />
              </label>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};
