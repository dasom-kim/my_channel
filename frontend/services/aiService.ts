import { GoogleGenAI, Type } from '@google/genai';
import { Channel, UserPreferences } from '../types';

// Initialize GenAI. In a real app, handle missing API keys gracefully.
// For this demo, we'll try to use it if available, otherwise fallback to local logic.
let ai: GoogleGenAI | null = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
  }
} catch (e) {
  console.warn("GenAI initialization failed. Falling back to local logic.", e);
}

export const getRecommendedChannel = async (
  channels: Channel[],
  preferences: UserPreferences
): Promise<{ channelId: string; reason: string }> => {
  // Filter out 3rd party cams from general recommendations unless specifically requested
  const broadcastChannels = channels.filter(c => !c.isThirdParty);

  if (!preferences.favoriteGenres.length) {
    return { channelId: broadcastChannels[0].id, reason: "설정된 취향이 없어 기본 채널을 보여드립니다." };
  }

  // Try using Gemini for intelligent recommendation
  if (ai) {
    try {
      const prompt = `
        당신은 스마트 TV의 AI 어시스턴트입니다. 사용자의 취향을 바탕으로 가장 적합한 채널을 추천해야 합니다.
        
        사용자의 선호 장르: ${preferences.favoriteGenres.join(', ')}
        
        현재 방송 중인 채널 및 프로그램:
        ${broadcastChannels.map(c => `- 채널 ${c.id} (${c.name}): "${c.currentProgram.title}" (장르: ${c.currentProgram.genre}) - ${c.currentProgram.description}`).join('\n')}
        
        사용자의 취향과 현재 방송 중인 프로그램을 분석하세요.
        가장 취향에 맞는 채널 ID 하나를 선택하세요. 정확히 일치하는 장르가 없다면 가장 유사한 주제나 인기 있는 채널을 선택하세요.
        선택한 이유를 시청자가 흥미를 느낄 수 있도록 한국어로 1문장으로 짧게 작성해주세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              channelId: { type: Type.STRING, description: "추천하는 채널의 ID" },
              reason: { type: Type.STRING, description: "추천하는 이유 (한국어 1문장)" }
            },
            required: ["channelId", "reason"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        // Verify the ID exists
        if (broadcastChannels.find(c => c.id === result.channelId)) {
          return result;
        }
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Fallthrough to local logic
    }
  }

  // Fallback local logic if Gemini fails or is unavailable
  console.log("Using local recommendation logic");
  
  // 1. Try to find an exact genre match
  for (const genre of preferences.favoriteGenres) {
    const match = broadcastChannels.find(c => c.currentProgram.genre === genre);
    if (match) {
      return { 
        channelId: match.id, 
        reason: `고객님이 좋아하는 '${genre}' 장르의 프로그램이 방송 중입니다.` 
      };
    }
  }

  // 2. Default to the first channel if no match
  return { 
    channelId: broadcastChannels[0].id, 
    reason: "현재 가장 인기 있는 방송을 추천해 드립니다." 
  };
};
