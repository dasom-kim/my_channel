export type Genre =
  | '음악'
  | '푸드'
  | '예능'
  | '스포츠'
  | '라이프'
  | '애니/키즈'
  | '뉴스/정보'
  | '건강/교양'
  | '영화'
  | '홈캠';

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
