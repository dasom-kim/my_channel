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
