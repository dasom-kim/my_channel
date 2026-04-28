# YouTube TV Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 방송 채널 데이터를 유튜브 메타데이터로 바꾸고, TV 같은 UI를 유지한 채 실제 유튜브 영상이 재생되도록 플레이어를 수정한다.

**Architecture:** 방송 채널의 `currentProgram.videoUrl`에 유튜브 URL을 저장하고, 별도 유틸에서 이를 embed URL과 썸네일로 변환한다. `VideoPlayer`는 유튜브 URL이면 `iframe`을 렌더링하고, 파싱 실패 시 기존 배경 기반 fallback을 보여준다.

**Tech Stack:** React, TypeScript, Vite, Vitest

---

### Task 1: 테스트 기반 유튜브 URL 파싱 유틸 추가

**Files:**
- Create: `frontend/utils/youtube.ts`
- Create: `frontend/utils/youtube.test.ts`
- Modify: `frontend/package.json`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { parseYouTubeUrl } from './youtube';

describe('parseYouTubeUrl', () => {
  it('parses a watch url into an embed url', () => {
    expect(
      parseYouTubeUrl('https://www.youtube.com/watch?v=JZU3p0Gmsio')
    ).toMatchObject({
      videoId: 'JZU3p0Gmsio',
      embedUrl: 'https://www.youtube.com/embed/JZU3p0Gmsio?autoplay=1&mute=1&controls=0&rel=0&playsinline=1',
    });
  });

  it('ignores playlist parameters and keeps the main video id', () => {
    expect(
      parseYouTubeUrl('https://www.youtube.com/watch?v=izrOhJp_5DU&list=RDizrOhJp_5DU&start_radio=1')
    )?.toMatchObject({
      videoId: 'izrOhJp_5DU',
    });
  });

  it('supports short urls', () => {
    expect(
      parseYouTubeUrl('https://youtu.be/yJBIDjUAxrY')
    )?.toMatchObject({
      videoId: 'yJBIDjUAxrY',
    });
  });

  it('returns null for invalid urls', () => {
    expect(parseYouTubeUrl('https://example.com/video')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix frontend`
Expected: FAIL with module or export not found for `./youtube` or missing test runner

- [ ] **Step 3: Write minimal implementation**

```ts
const YOUTUBE_EMBED_PARAMS = 'autoplay=1&mute=1&controls=0&rel=0&playsinline=1';

export type ParsedYouTubeVideo = {
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
};

export function parseYouTubeUrl(url: string): ParsedYouTubeVideo | null {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  const host = parsedUrl.hostname.replace(/^www\./, '');
  let videoId: string | null = null;

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsedUrl.pathname === '/watch') {
      videoId = parsedUrl.searchParams.get('v');
    } else if (parsedUrl.pathname.startsWith('/embed/')) {
      videoId = parsedUrl.pathname.split('/')[2] ?? null;
    }
  } else if (host === 'youtu.be') {
    videoId = parsedUrl.pathname.slice(1);
  }

  if (!videoId) {
    return null;
  }

  return {
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}?${YOUTUBE_EMBED_PARAMS}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix frontend`
Expected: PASS for `frontend/utils/youtube.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/utils/youtube.ts frontend/utils/youtube.test.ts
git commit -m "test: add youtube url parser coverage"
```

### Task 2: 채널 메타데이터와 타입을 유튜브 기반으로 갱신

**Files:**
- Modify: `frontend/types.ts`
- Modify: `frontend/constants.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { MOCK_CHANNELS } from '../constants';

describe('broadcast channel metadata', () => {
  it('stores youtube urls for non-third-party channels', () => {
    const broadcastChannels = MOCK_CHANNELS.filter((channel) => !channel.isThirdParty);

    expect(broadcastChannels).toHaveLength(10);
    expect(
      broadcastChannels.every((channel) => channel.currentProgram.videoUrl.includes('youtube.com'))
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix frontend`
Expected: FAIL because current broadcast data count and URLs do not match

- [ ] **Step 3: Write minimal implementation**

```ts
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
```

```ts
export const ALL_GENRES: Genre[] = [
  '음악',
  '푸드',
  '예능',
  '스포츠',
  '라이프',
  '애니/키즈',
  '뉴스/정보',
  '건강/교양',
  '영화',
  '홈캠',
];
```

```ts
// Replace the broadcast entries in MOCK_CHANNELS with the 10 user-provided youtube metadata items.
// Keep third-party camera channels unchanged.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix frontend`
Expected: PASS for metadata expectations

- [ ] **Step 5: Commit**

```bash
git add frontend/types.ts frontend/constants.ts
git commit -m "feat: update channel lineup with youtube metadata"
```

### Task 3: VideoPlayer를 유튜브 임베드와 fallback UI로 전환

**Files:**
- Modify: `frontend/components/VideoPlayer.tsx`
- Modify: `frontend/package.json`

- [ ] **Step 1: Write the failing test**

```ts
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VideoPlayer } from './VideoPlayer';

it('renders a youtube iframe for broadcast channels with youtube urls', () => {
  render(
    <VideoPlayer
      channel={{
        id: 'ch-101',
        number: 101,
        name: 'Essential playlist',
        currentProgram: {
          id: 'epg_001',
          title: 'Essential - 트렌디 팝 플레이리스트',
          genre: '음악',
          description: 'desc',
          thumbnail: 'thumb',
          videoUrl: 'https://www.youtube.com/watch?v=izrOhJp_5DU',
          startTime: '00:00',
          endTime: '23:59',
        },
      }}
      isChangingChannel={false}
    />
  );

  expect(screen.getByTitle('Essential - 트렌디 팝 플레이리스트')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix frontend`
Expected: FAIL because no iframe is rendered or testing utilities are missing

- [ ] **Step 3: Write minimal implementation**

```tsx
const youtubeVideo = !channel.isThirdParty ? parseYouTubeUrl(channel.currentProgram.videoUrl) : null;

return (
  <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
    {youtubeVideo ? (
      <iframe
        key={channel.id}
        src={youtubeVideo.embedUrl}
        title={channel.currentProgram.title}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    ) : (
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${showStatic ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url(${channel.currentProgram.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: channel.isThirdParty ? 'brightness(0.8) contrast(1.1)' : 'none',
        }}
      />
    )}
  </div>
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix frontend`
Expected: PASS for `VideoPlayer` rendering tests

- [ ] **Step 5: Commit**

```bash
git add frontend/components/VideoPlayer.tsx frontend/package.json
git commit -m "feat: render youtube embeds in tv player"
```

### Task 4: 전체 검증과 마무리

**Files:**
- Verify only

- [ ] **Step 1: Run targeted tests**

Run: `npm test --prefix frontend`
Expected: PASS

- [ ] **Step 2: Run production build**

Run: `npm run build --prefix frontend`
Expected: build completes successfully with exit code 0

- [ ] **Step 3: Manual behavior check**

Run: `npm run dev --prefix frontend`
Expected:
- 방송 채널 선택 시 유튜브 영상이 표시된다
- OSD 정보가 채널 데이터와 맞는다
- 채널 전환 시 static 효과가 유지된다
- 홈캠 채널은 기존 fallback 스타일이 유지된다

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: support youtube playback in tv channel ui"
```
