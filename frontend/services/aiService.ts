import { Channel, UserPreferences } from '../types';

// This is a mock AI service. In a real application, this would be a call to a backend service.
export const getRecommendedChannel = async (
  activeChannels: Channel[],
  preferences: UserPreferences
): Promise<{ channelId: string; reason: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const nonLiveChannels = activeChannels.filter(c => !c.isThirdParty);

  if (nonLiveChannels.length === 0) {
    return { channelId: activeChannels[0].id, reason: '기본 채널을 표시합니다.' };
  }

  // 1. Find channels that match the user's favorite genres
  if (preferences.favoriteGenres.length > 0) {
    const favoriteChannels = nonLiveChannels.filter(channel =>
      preferences.favoriteGenres.includes(channel.currentProgram.genre)
    );

    if (favoriteChannels.length > 0) {
      // Pick a random channel from the favorites
      const recommended = favoriteChannels[Math.floor(Math.random() * favoriteChannels.length)];
      // Return the specific genre that was the reason for the recommendation
      return {
        channelId: recommended.id,
        reason: `'${recommended.currentProgram.genre}'`, // Return the matched genre itself
      };
    }
  }

  // 2. Fallback: If no favorites match, recommend a random non-live channel
  const randomChannel = nonLiveChannels[Math.floor(Math.random() * nonLiveChannels.length)];
  return {
    channelId: randomChannel.id,
    reason: '다양한 콘텐츠를 즐겨보세요!', // Generic fallback reason
  };
};
