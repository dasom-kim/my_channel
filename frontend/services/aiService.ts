import { GoogleGenAI, Type } from '@google/genai';
import { Channel, UserPreferences } from '../types';

// 프록시 서버를 통해 API 키가 주입되므로 클라이언트 측 설정 유지
const ai = new GoogleGenAI({ apiKey: 'GEMINI_AI_KEY', vertexai: true });

/**
 * 1단계: 사용자 페르소나 분석 (Persona Analysis)
 * 시청 이력과 선호도를 기반으로 사용자의 시청 성향을 요약합니다.
 */
const generateUserPersona = async (preferences: UserPreferences): Promise<string> => {
  const prompt = `
    다음 데이터를 바탕으로 사용자의 시청 취향과 현재 상태를 2문장으로 요약하여 페르소나를 도출하세요.
    - 선호 장르: ${preferences.favoriteGenres.join(', ')}
    - 계정 연동 상태: ${preferences.isGoogleConnected ? '연동됨' : '미연동'}
    - 등록된 기기: ${preferences.connectedCams.join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    return response.text || "콘텐츠를 즐기는 시청자";
  } catch (error) {
    return "다양한 프로그램을 즐기는 시청자";
  }
};

/**
 * 2단계: 추천 엔진 실행 (Recall & Reasoning)
 * 도출된 페르소나와 일치하는 최적의 채널을 선정하고 추천 사유를 생성합니다.
 */
export const getRecommendedChannel = async (
  channels: Channel[],
  preferences: UserPreferences
): Promise<{ channelId: string; reason: string }> => {
  
  // 써드파티 앱(YouTube 등)을 제외한 실제 방송 채널만 후보군으로 설정 (Recall)
  const broadcastChannels = channels.filter(c => !c.isThirdParty);

  try {
    // 1. 페르소나 분석 단계 수행
    const persona = await generateUserPersona(preferences);

    // 2. 최종 선정 및 사유 생성 (Reasoning)
    const prompt = `
      당신은 스마트 TV PD입니다. 사용자 페르소나를 분석하여 아래 후보 중 1개를 선정하세요.
      
      [사용자 페르소나]
      ${persona}
      
      [추천 후보군]
      ${broadcastChannels.map(c => `- ID: ${c.id}, 제목: ${c.currentProgram.title}, 장르: ${c.currentProgram.genre}, 설명: ${c.currentProgram.description}`).join('\n')}
      
      [출력 규격] 반드시 JSON 형식으로만 답변하세요.
      {
        "selected_id": "ID",
        "reason": "사용자에게 전달할 따뜻하고 유쾌한 추천 멘트 (1문장)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            selected_id: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["selected_id", "reason"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      const selectedChannel = broadcastChannels.find(c => c.id === result.selected_id);
      
      if (selectedChannel) {
        return { channelId: selectedChannel.id, reason: result.reason };
      }
    }
  } catch (error) {
    console.error("추천 엔진 실행 중 오류 발생:", error);
  }

  // Fallback: 오류 시 기본 매칭 로직 사용
  const fallback = broadcastChannels.find(c => preferences.favoriteGenres.includes(c.currentProgram.genre)) || broadcastChannels[0];
  return { 
    channelId: fallback.id, 
    reason: "오늘의 인기 채널을 준비했습니다. 즐거운 시청 되세요!" 
  };
};