import { describe, expect, it } from 'vitest';
import { MOCK_CHANNELS } from './constants';

describe('broadcast channel metadata', () => {
  it('stores youtube urls for non-third-party channels', () => {
    const broadcastChannels = MOCK_CHANNELS.filter((channel) => !channel.isThirdParty);

    expect(broadcastChannels).toHaveLength(10);
    expect(
      broadcastChannels.every((channel) =>
        channel.currentProgram.videoUrl.includes('youtube.com')
      )
    ).toBe(true);
  });
});
