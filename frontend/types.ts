export type Genre = 
  | 'SF' 
  | '시티팝' 
  | '뉴스' 
  | '스포츠' 
  | '키즈' 
  | '다큐멘터리' 
  | '홈캠'
  | '영화'
  | '예능'
  | '연애 프로그램';

export interface Program {
  id: string;
  title: string;
  genre: Genre;
  description: string;
  thumbnail: string;
  videoUrl: string;
  startTime: string;
  endTime: string;
}

export interface Channel {
  id: string;
  name: string;
  number: number;
  currentProgram: Program;
  isThirdParty?: boolean;
  brandId?: string;
  logo?: string;
}

export interface AlertEvent {
  id: string;
  type: 'motion' | 'sound' | 'system';
  message: string;
  channelId: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface CamBrand {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserPreferences {
  favoriteGenres: Genre[];
  autoSwitchToMyChannel: boolean;
  enableSmartAlerts: boolean;
  connectedCams: string[];
  isGoogleConnected: boolean;
}
