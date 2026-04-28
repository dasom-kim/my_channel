import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { VideoPlayer } from './VideoPlayer';

const firstChannel = {
  id: 'ch-101',
  number: 101,
  name: 'Essential playlist',
  currentProgram: {
    id: 'epg_001',
    title: 'Essential - 트렌디 팝 플레이리스트',
    genre: '음악' as const,
    description: 'desc',
    thumbnail: 'thumb',
    videoUrl: 'https://www.youtube.com/watch?v=izrOhJp_5DU',
    startTime: '00:00',
    endTime: '23:59',
  },
};

const secondChannel = {
  ...firstChannel,
  id: 'ch-102',
  name: '쯔양',
  currentProgram: {
    ...firstChannel.currentProgram,
    id: 'epg_002',
    title: '심야의 K-분식 먹방',
    videoUrl: 'https://www.youtube.com/watch?v=JZU3p0Gmsio',
  },
};

afterEach(() => {
  vi.useRealTimers();
});

describe('VideoPlayer', () => {
  it('renders a youtube iframe for broadcast channels with youtube urls', () => {
    render(
      <VideoPlayer
        channel={firstChannel}
        isChangingChannel={false}
      />
    );

    expect(screen.getByTitle('Essential - 트렌디 팝 플레이리스트')).toBeInTheDocument();
  });

  it('clears the static overlay after a channel change completes', () => {
    vi.useFakeTimers();

    const { rerender, container } = render(
      <VideoPlayer
        channel={firstChannel}
        isChangingChannel={false}
      />
    );

    rerender(
      <VideoPlayer
        channel={firstChannel}
        isChangingChannel={true}
      />
    );

    rerender(
      <VideoPlayer
        channel={secondChannel}
        isChangingChannel={false}
      />
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(container.querySelector('.tv-static')).not.toBeInTheDocument();
  });
});
