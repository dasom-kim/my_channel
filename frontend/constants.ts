import { Channel, Genre, CamBrand } from './types';

export const ALL_GENRES: Genre[] = [
  'SF', '시티팝', '뉴스', '스포츠', '키즈', '다큐멘터리', '영화', '예능'
];

export const CAM_BRANDS: CamBrand[] = [
  { id: 'tplink', name: 'TP-Link', icon: 'Camera', description: 'TP-Link Tapo 및 Kasa 스마트 카메라를 연결합니다.' },
  { id: 'truen', name: '트루엔', icon: 'Home', description: '트루엔(Truen) 홈 카메라 및 보안 시스템을 연동합니다.' },
  { id: 'goqual', name: '고퀄', icon: 'BellRing', description: '고퀄(Goqual) 헤이홈 스마트 카메라를 통합합니다.' },
  { id: 'gopro', name: 'GoPro', icon: 'Video', description: 'GoPro 액션 카메라에서 실시간으로 스트리밍합니다.' }
];

export const MOCK_CHANNELS: Channel[] = [
  {
    id: 'ch-101',
    number: 101,
    name: '삼성 액션',
    currentProgram: {
      id: 'p-1',
      title: '사이버펑크 2077: 엣지러너',
      genre: 'SF',
      description: '미래의 기술과 신체 개조에 집착하는 도시에서 살아남으려는 스트리트 키드의 이야기.',
      thumbnail: 'https://picsum.photos/seed/scifi1/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      startTime: '14:00',
      endTime: '15:30'
    }
  },
  {
    id: 'ch-102',
    number: 102,
    name: '레트로 바이브',
    currentProgram: {
      id: 'p-2',
      title: '80년대 시티팝 믹스',
      genre: '시티팝',
      description: '황금기 일본 시티팝 명곡들의 연속 믹스 방송.',
      thumbnail: 'https://picsum.photos/seed/citypop/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      startTime: '12:00',
      endTime: '18:00'
    }
  },
  {
    id: 'ch-103',
    number: 103,
    name: '글로벌 뉴스 24',
    currentProgram: {
      id: 'p-3',
      title: '세계 뉴스 라이브',
      genre: '뉴스',
      description: '전 세계의 속보를 실시간으로 전해드립니다.',
      thumbnail: 'https://picsum.photos/seed/news/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      startTime: '14:00',
      endTime: '15:00'
    }
  },
  {
    id: 'ch-104',
    number: 104,
    name: '스포츠 센트럴',
    currentProgram: {
      id: 'p-4',
      title: '프리미어 리그 클래식',
      genre: '스포츠',
      description: '프리미어 리그 역사상 가장 위대했던 명경기를 다시 봅니다.',
      thumbnail: 'https://picsum.photos/seed/sports/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      startTime: '13:00',
      endTime: '16:00'
    }
  },
  {
    id: 'ch-105',
    number: 105,
    name: '키즈 존',
    currentProgram: {
      id: 'p-5',
      title: '뽀롱뽀롱 뽀로로',
      genre: '키즈',
      description: '눈 덮인 숲속 마을에서 펼쳐지는 뽀로로와 친구들의 모험.',
      thumbnail: 'https://picsum.photos/seed/kids/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      startTime: '14:30',
      endTime: '15:00'
    }
  },
  {
    id: 'ch-106',
    number: 106,
    name: '로맨스 TV',
    currentProgram: {
      id: 'p-6',
      title: '연애의 참견 스페셜',
      genre: '연애 프로그램',
      description: '누구보다 독하게, 단호하게 연애 진단을 내려주는 본격 로맨스 파괴 토크쇼.',
      thumbnail: 'https://picsum.photos/seed/romance/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      startTime: '14:00',
      endTime: '16:00'
    }
  },
  // 3rd Party Camera Channels
  {
    id: 'ch-999',
    number: 999,
    name: '거실 카메라',
    isThirdParty: true,
    brandId: 'tplink',
    currentProgram: {
      id: 'p-cam-1',
      title: '실시간: 거실',
      genre: '홈캠',
      description: 'TP-Link에 연결된 홈 카메라의 실시간 스트림입니다.',
      thumbnail: 'https://picsum.photos/seed/homecam/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      startTime: '00:00',
      endTime: '23:59'
    }
  },
  {
    id: 'ch-998',
    number: 998,
    name: '현관문',
    isThirdParty: true,
    brandId: 'truen',
    currentProgram: {
      id: 'p-cam-2',
      title: '실시간: 현관문',
      genre: '홈캠',
      description: '트루엔 보안 카메라의 실시간 스트림입니다.',
      thumbnail: 'https://picsum.photos/seed/frontdoor/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      startTime: '00:00',
      endTime: '23:59'
    }
  },
  {
    id: 'ch-997',
    number: 997,
    name: '아기방',
    isThirdParty: true,
    brandId: 'goqual',
    currentProgram: {
      id: 'p-cam-3',
      title: '실시간: 아기방',
      genre: '홈캠',
      description: '고퀄 헤이홈 카메라의 실시간 스트림입니다.',
      thumbnail: 'https://picsum.photos/seed/babyroom/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      startTime: '00:00',
      endTime: '23:59'
    }
  },
  {
    id: 'ch-996',
    number: 996,
    name: '헬멧 캠',
    isThirdParty: true,
    brandId: 'gopro',
    currentProgram: {
      id: 'p-cam-4',
      title: '실시간: 액션 캠',
      genre: '홈캠',
      description: '연결된 GoPro의 실시간 방송입니다.',
      thumbnail: 'https://picsum.photos/seed/gopro/1280/720',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      startTime: '00:00',
      endTime: '23:59'
    }
  }
];
