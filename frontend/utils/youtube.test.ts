import { describe, expect, it } from 'vitest';
import { parseYouTubeUrl } from './youtube';

describe('parseYouTubeUrl', () => {
  it('parses a watch url into an embed url', () => {
    expect(
      parseYouTubeUrl('https://www.youtube.com/watch?v=JZU3p0Gmsio')
    ).toMatchObject({
      videoId: 'JZU3p0Gmsio',
      embedUrl:
        'https://www.youtube.com/embed/JZU3p0Gmsio?autoplay=1&mute=1&controls=0&rel=0&playsinline=1',
    });
  });

  it('ignores playlist parameters and keeps the main video id', () => {
    expect(
      parseYouTubeUrl('https://www.youtube.com/watch?v=izrOhJp_5DU&list=RDizrOhJp_5DU&start_radio=1')
    ).toMatchObject({
      videoId: 'izrOhJp_5DU',
    });
  });

  it('supports short urls', () => {
    expect(parseYouTubeUrl('https://youtu.be/yJBIDjUAxrY')).toMatchObject({
      videoId: 'yJBIDjUAxrY',
    });
  });

  it('returns null for invalid urls', () => {
    expect(parseYouTubeUrl('https://example.com/video')).toBeNull();
  });
});
