import React, { useEffect, useState, useRef } from 'react';
import { AlertEvent, Channel } from '../types';
import { Bell, Maximize2, X } from 'lucide-react';

interface SmartAlertPiPProps {
  alert: AlertEvent | null;
  camChannel: Channel | undefined;
  onAccept: (channelId: string) => void;
  onDismiss: () => void;
}

export const SmartAlertPiP: React.FC<SmartAlertPiPProps> = ({ alert, camChannel, onAccept, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (alert && camChannel) {
      setIsVisible(true);
      // Auto-dismiss after 15 seconds if ignored
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for exit animation
      }, 15000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [alert, camChannel, onDismiss]);

  // Explicitly call play() when PiP becomes visible
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("PiP Video autoplay failed:", error);
      });
    }
  }, [isVisible, camChannel?.currentProgram.videoUrl]);

  if (!alert || !camChannel) return null;

  return (
    <div 
      className={`absolute bottom-12 right-12 w-96 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
      } z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-red-500/20 border-b border-red-500/30">
        <div className="flex items-center gap-2 text-red-400">
          <Bell size={18} className="animate-bounce" />
          <span className="font-semibold text-sm tracking-wide uppercase">스마트 알림</span>
        </div>
        <button onClick={() => { setIsVisible(false); setTimeout(onDismiss, 300); }} className="text-white/50 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-white font-medium mb-3">{alert.message}</p>
        
        {/* PiP Video Preview */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-4 border border-white/5">
          <video 
            ref={videoRef}
            src={camChannel.currentProgram.videoUrl} 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-red-400">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onAccept(alert.channelId), 300);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            <Maximize2 size={16} />
            카메라로 전환
          </button>
          <button 
            onClick={() => { setIsVisible(false); setTimeout(onDismiss, 300); }}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            무시
          </button>
        </div>
      </div>
    </div>
  );
};
