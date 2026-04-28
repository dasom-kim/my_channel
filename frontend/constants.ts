import { Channel, Genre, CamBrand } from './types';

export const ALL_GENRES: Genre[] = [
  '음악', '푸드', '예능', '스포츠', '라이프', '애니/키즈', '뉴스/정보', '건강/교양', '영화'
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
    name: 'Essential playlist',
    currentProgram: {
      id: 'epg_001',
      title: 'Essential - 트렌디 팝 플레이리스트',
      genre: '음악',
      description: '감각적인 영상과 함께 즐기는 최신 유행 팝송 모음입니다.',
      thumbnail: 'https://i.ytimg.com/vi/izrOhJp_5DU/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=izrOhJp_5DU&list=RDizrOhJp_5DU&start_radio=1',
      startTime: '14:00',
      endTime: '15:00'
    }
  },
  {
    id: 'ch-102',
    number: 102,
    name: '쯔양',
    currentProgram: {
      id: 'epg_002',
      title: '심야의 K-분식 먹방',
      genre: '푸드',
      description: '떡볶이, 튀김 등 한국 대표 분식 메뉴를 즐기는 쯔양의 먹방 콘텐츠입니다.',
      thumbnail: 'https://i.ytimg.com/vi/JZU3p0Gmsio/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=JZU3p0Gmsio',
      startTime: '15:00',
      endTime: '16:00'
    }
  },
  {
    id: 'ch-103',
    number: 103,
    name: 'tvN',
    currentProgram: {
      id: 'epg_003',
      title: '환승연애 (연애 리얼리티)',
      genre: '예능',
      description: '헤어진 커플들이 한 집에 모여 과거를 돌아보고 새로운 사랑을 찾는 리얼리티 프로그램입니다.',
      thumbnail: 'https://i.ytimg.com/vi/_yDUer6xGpY/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=_yDUer6xGpY',
      startTime: '16:00',
      endTime: '17:00'
    }
  },
  {
    id: 'ch-104',
    number: 104,
    name: 'JTBC',
    currentProgram: {
      id: 'epg_004',
      title: '최강야구 하이라이트',
      genre: '스포츠',
      description: '은퇴한 레전드 선수들이 팀을 결성해 현역 선수들과 승부를 겨루는 야구 예능입니다.',
      thumbnail: 'https://i.ytimg.com/vi/bj4HGqF1Mso/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=bj4HGqF1Mso',
      startTime: '17:00',
      endTime: '18:00'
    }
  },
  {
    id: 'ch-105',
    number: 105,
    name: '홈캠',
    currentProgram: {
      id: 'epg_005',
      title: '반려견 실시간 스트리밍',
      genre: '라이프',
      description: '집에 홀로 남은 반려견의 모습을 실시간으로 확인할 수 있는 라이브 서비스입니다.',
      thumbnail: 'https://i.ytimg.com/vi/cbxtDWts340/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=cbxtDWts340',
      startTime: '18:00',
      endTime: '19:00'
    }
  },
  {
    id: 'ch-106',
    number: 106,
    name: 'kids',
    currentProgram: {
      id: 'epg_006',
      title: '뽀롱뽀롱 뽀로로',
      genre: '애니/키즈',
      description: '꼬마 펭귄 뽀로로와 숲속 친구들의 모험을 담은 어린이 애니메이션입니다.',
      thumbnail: 'https://i.ytimg.com/vi/P9-l1zavUw4/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=P9-l1zavUw4',
      startTime: '19:00',
      endTime: '20:00'
    }
  },
  {
    id: 'ch-107',
    number: 107,
    name: '연합뉴스',
    currentProgram: {
      id: 'epg_007',
      title: '자정 마감 심층 경제',
      genre: '뉴스/정보',
      description: '당일의 주요 경제 이슈를 심층적으로 분석하고 요약해주는 뉴스 프로그램입니다.',
      thumbnail: 'https://i.ytimg.com/vi/yhpbioCP6nA/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=yhpbioCP6nA',
      startTime: '20:00',
      endTime: '21:00'
    }
  },
  {
    id: 'ch-108',
    number: 108,
    name: 'K-바둑',
    currentProgram: {
      id: 'epg_008',
      title: '제 20회 명인전',
      genre: '스포츠',
      description: '국내 바둑계의 최고 권위자들을 가리는 명인전 결선 대국 중계입니다.',
      thumbnail: 'https://i.ytimg.com/vi/yJBIDjUAxrY/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=yJBIDjUAxrY',
      startTime: '21:00',
      endTime: '22:00'
    }
  },
  {
    id: 'ch-109',
    number: 109,
    name: '시니어TV',
    currentProgram: {
      id: 'epg_009',
      title: '100세 시대 건강 체조',
      genre: '건강/교양',
      description: '어르신들의 근력 유지와 건강을 위해 고안된 따라 하기 쉬운 체조 가이드입니다.',
      thumbnail: 'https://i.ytimg.com/vi/XgrswJCa7k8/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=XgrswJCa7k8',
      startTime: '22:00',
      endTime: '23:00'
    }
  },
  {
    id: 'ch-110',
    number: 110,
    name: '클래식무비',
    currentProgram: {
      id: 'epg_010',
      title: '80년대 명작 극장',
      genre: '영화',
      description: '80년대를 풍미했던 추억의 명작 영화들을 고화질로 감상할 수 있는 프로그램입니다.',
      thumbnail: 'https://i.ytimg.com/vi/9qwgnWu_ZMI/hqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=9qwgnWu_ZMI',
      startTime: '23:00',
      endTime: '23:59'
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
      videoUrl: './living_room.mp4',
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
      videoUrl: './front_door.mp4',
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
      videoUrl: './kids_room.mp4',
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
      videoUrl: './gopro.mp4',
      startTime: '00:00',
      endTime: '23:59'
    }
  }
];
