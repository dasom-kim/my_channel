# YouTube TV Embed Design

## Goal
현재 데모 앱의 방송 채널이 정적인 썸네일 배경 대신 실제 유튜브 영상을 재생하도록 바꾸되, 기존의 TV 같은 몰입형 UI와 OSD, 채널 전환 경험은 유지한다.

## Current State
- 방송 채널 데이터는 `frontend/constants.ts`의 `MOCK_CHANNELS`에 하드코딩되어 있다.
- 각 채널의 `currentProgram.videoUrl`에는 현재 샘플 mp4 URL이 들어 있지만, `frontend/components/VideoPlayer.tsx`는 이 값을 재생에 사용하지 않는다.
- `VideoPlayer`는 `thumbnail`을 전체 화면 배경으로 렌더링하고, 채널 전환 시 static 효과만 보여준다.
- 프로그램 정보는 `frontend/components/OSD.tsx`가 오버레이 형태로 렌더링한다.
- 채널 목록은 `frontend/components/ChannelList.tsx`에서 사이드바 형태로 렌더링한다.

## User Intent
- 사용자가 제공한 유튜브 메타데이터를 방송 채널 데이터로 반영하고 싶다.
- 영상은 실제 유튜브 콘텐츠가 재생되어야 한다.
- 플레이어 모양은 유튜브 웹페이지보다 TV 방송 화면에 가까워야 한다.
- 설명은 텍스트 중심으로 진행하며, 별도 시각 도구는 사용하지 않는다.

## Scope
이번 변경에서 포함하는 범위는 다음과 같다.

1. 방송 채널용 프로그램 메타데이터를 유튜브 URL 기반으로 갱신한다.
2. 유튜브 watch URL을 iframe embed URL로 변환하는 프론트엔드 로직을 추가한다.
3. `VideoPlayer`가 유튜브 영상을 실제로 재생하도록 수정한다.
4. 기존 OSD, 채널 리스트, 채널 전환 static 효과를 유지한다.
5. URL 파싱 실패 또는 임베드 불가 상황에서 UI가 깨지지 않도록 fallback을 둔다.

이번 변경에서 제외하는 범위는 다음과 같다.

- 백엔드 API 추가 또는 메타데이터 저장 구조 변경
- 실시간 EPG 편성표 시스템 구축
- 유튜브 Data API 연동
- 플레이어 리모컨 조작, 재생 위치 동기화, 고급 접근성 제어
- 외부 홈캠 채널의 재생 방식 변경

## Recommended Approach
추천 방식은 "현재 구조 유지 + 유튜브 URL 파싱 유틸 추가 + iframe TV 스타일 래핑"이다.

이 접근을 선택하는 이유는 다음과 같다.

- 기존 UI 구조를 크게 흔들지 않고 목표를 달성할 수 있다.
- 데이터는 기존 `currentProgram.videoUrl` 필드를 재사용하므로 타입 변경이 작다.
- `VideoPlayer`만 중심적으로 수정하면 되므로 영향 범위를 좁게 유지할 수 있다.
- 이후 일반 mp4, 유튜브 URL, 홈캠 스트림을 분기 처리하는 구조로 확장하기 쉽다.

## Data Design
방송 채널 데이터는 사용자가 제공한 메타데이터를 기반으로 갱신한다.

- `currentProgram.id`: 제공받은 메타데이터의 `id`를 사용
- `currentProgram.title`: 제공받은 `title` 사용
- `currentProgram.genre`: 기존 `Genre` 유니온과 맞도록 매핑 필요
- `currentProgram.description`: 제공받은 `description` 사용
- `currentProgram.videoUrl`: 제공받은 `url` 사용
- `currentProgram.thumbnail`: 유튜브 썸네일 URL 또는 fallback 이미지 사용

### Genre Mapping
사용자가 제공한 장르는 현재 타입과 완전히 일치하지 않는다. 따라서 기존 `Genre` 타입과 필터링 로직에 맞는 정규화가 필요하다.

예시 매핑:
- `음악` -> `시티팝` 또는 새 타입 `음악` 추가
- `푸드` -> 새 타입 추가 또는 `예능`으로 매핑
- `애니/키즈` -> `키즈`
- `뉴스/정보` -> `뉴스`
- `건강/교양` -> 새 타입 추가 또는 `다큐멘터리`로 매핑
- `영화` -> `영화`
- `예능` -> `예능`

구현에서는 실제 데이터 의미를 잃지 않도록 `Genre` 타입과 `ALL_GENRES`를 함께 확장한다. 기본 선호 장르는 새 장르가 추가되더라도 기존 기본값을 유지하고, 필터링 로직이 깨지지 않도록 새 장르를 허용하는 방향으로 맞춘다.

## Player Behavior
`VideoPlayer`는 채널의 성격에 따라 재생 방식을 분기한다.

### Broadcast Channels
일반 방송 채널은 다음 우선순위로 렌더링한다.

1. `videoUrl`이 유튜브 URL이면 전체 화면 iframe embed 재생
2. 유튜브 URL 파싱에 실패하면 썸네일 기반 fallback 배경 렌더링
3. 오버레이 그라데이션과 TV 느낌의 시각 효과는 유지

유튜브 임베드 파라미터는 TV 같은 경험을 위해 다음 방향을 따른다.

- 자동 재생 활성화
- 음소거 기반 시작으로 브라우저 자동재생 제한 회피
- 관련 동영상/브랜드 노출 최소화
- 인라인 재생 유지
- 전체 화면 영역 채우기

### Third-Party Camera Channels
홈캠 같은 외부 입력 채널은 기존 시각 스타일을 우선 유지한다.

- 이번 작업에서는 카메라 채널을 유튜브 기반으로 바꾸지 않는다.
- 필요하면 기존 썸네일/배경 방식 유지
- `Live Cam` 배지 로직 유지

## URL Parsing Design
유튜브 URL 처리 로직은 별도 유틸 함수로 분리한다. 함수는 다음 책임을 가진다.

1. `watch?v=` 형식 URL에서 video ID 추출
2. `youtu.be/...` 단축 URL도 지원한다.
3. playlist, start time 같은 부가 query가 있어도 기본 video ID는 안정적으로 추출
4. 추출 성공 시 embed URL 생성
5. 실패 시 `null` 반환

예상 인터페이스:

```ts
type ParsedYouTubeVideo = {
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
};

function parseYouTubeUrl(url: string): ParsedYouTubeVideo | null
```

이 유틸은 컴포넌트 바깥 별도 파일에 두어 테스트 가능성을 확보한다.

## UI and Visual Design
핵심 원칙은 "실제 영상은 유튜브, 겉모습은 TV"다.

- 플레이어는 화면 전체를 덮는 `iframe`으로 렌더링
- OSD는 기존처럼 위에 겹쳐서 제목, 설명, 추천 이유 표시
- 채널 목록은 기존 사이드바 동작 유지
- 채널 전환 시 현재 static 효과를 유지해 단순한 웹 임베드 느낌을 줄인다
- 플레이어 위에 약한 vignette/gradient를 유지해 방송 화면 같은 깊이감을 유지한다

유튜브 기본 컨트롤이 일부 보일 수는 있지만, 사용자 경험의 중심은 기존 OSD가 담당한다.

## Error Handling
실패 상황을 명시적으로 다룬다.

1. URL이 유효한 유튜브 링크가 아닌 경우
   - embed를 시도하지 않고 썸네일 또는 검은 배경 fallback 사용

2. 영상이 임베드를 허용하지 않는 경우
   - 브라우저 측에서 iframe 표시가 제한될 수 있으므로 플레이어 배경과 기본 텍스트가 유지되도록 한다

3. 자동재생이 차단되는 경우
   - `mute=1`을 사용해 자동재생 성공 가능성을 높인다
   - 그래도 차단되면 사용자가 클릭해 재생할 수 있는 여지를 남긴다

4. 메타데이터의 장르가 타입과 맞지 않는 경우
   - 타입 확장 또는 정규화 함수를 사용해 런타임 불일치를 막는다

## Testing Strategy
이번 작업은 UI 변경이지만, 가장 중요한 위험은 URL 파싱과 데이터 정합성이다. 따라서 테스트는 다음 우선순위를 따른다.

1. 유튜브 URL 파싱 유틸 단위 테스트
   - `watch?v=` URL
   - playlist query 포함 URL
   - 단축 URL
   - 잘못된 URL

2. 최소한의 렌더링 검증
   - 유튜브 URL인 경우 iframe 렌더링 여부
   - 파싱 실패 시 fallback UI 표시 여부

현재 프로젝트에 테스트 러너가 아직 없는 경우, 이번 기능 구현과 함께 너무 무거운 테스트 인프라를 도입하지 말고 현재 스택에 맞는 가장 작은 검증 수단을 선택한다.

## Files Expected to Change
- `frontend/constants.ts`
  - 방송 채널 메타데이터를 유튜브 기반으로 갱신
- `frontend/types.ts`
  - 장르 타입 확장 또는 정규화 대응
- `frontend/components/VideoPlayer.tsx`
  - iframe 임베드 기반 재생 및 fallback 추가
- `frontend/utils/youtube.ts` 같은 신규 유틸 파일
  - 유튜브 URL 파싱 함수 추가
- `frontend/package.json`
  - 현재 테스트 도구가 없으므로, 최소 단위 테스트를 위해 필요한 경우에만 작은 테스트 의존성을 추가

## Success Criteria
다음 조건을 만족하면 목표 달성으로 본다.

1. 방송 채널을 선택하면 해당 채널의 유튜브 영상이 화면에서 실제로 재생된다.
2. OSD와 채널 목록 UI는 기존처럼 동작한다.
3. 채널 전환 시 기존 static 효과가 유지된다.
4. 유튜브 URL에 playlist 등의 추가 query가 있어도 정상 재생된다.
5. URL 파싱 실패 시 앱이 깨지지 않고 fallback UI가 보인다.

## Open Decisions Resolved
- 플레이어 방향: `TV 화면처럼 자동 재생 중심`으로 확정
- 진행 방식: 텍스트로만 진행
- 구현 전략: 기존 구조 유지 + 유튜브 URL 파싱 + iframe 임베드
