
import { GoogleGenAI, Type, Chat } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * วิเคราะห์ความต้องการลงทุนทรัพย์กรมบังคับคดี (LED Investment Intent)
 */
export const analyzeIntent = async (intent: string, url: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `Analyze this LED property investment intent for URL: ${url}. Intent: ${intent}. Provide a structured JSON output with fields for AHP Analysis: suggested_name, frequency_hint, fields_to_extract (price, appraisal_value, location, size, status), and investment_priority_score (1-10).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggested_name: { type: Type.STRING },
          frequency_hint: { type: Type.STRING },
          fields_to_extract: { type: Type.ARRAY, items: { type: Type.STRING } },
          investment_priority_score: { type: Type.NUMBER }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * สร้าง Spider Code สำหรับทรัพย์กรมบังคับคดี (LED Optimized)
 */
export const generateSpider = async (intent: string, url: string, fields: string[], saveToDrive: boolean = false) => {
  const ai = getAI();
  const driveLogic = saveToDrive ? "Export directly to Google Drive as CSV for AHP processing." : "Standard CSV output.";
  
  const prompt = `Write a Scrapy spider for LED Properties: ${url}. 
  Focus on: ${fields.join(', ')}. 
  ${driveLogic}
  CRITICAL: Extract appraisal value vs starting price to calculate 'Investment Gap'. 
  Return ONLY clean Python code.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "คุณคือวิศวกร Scrapy และผู้เชี่ยวชาญการลงทุนอสังหาฯ กรมบังคับคดี เน้นการดึงข้อมูลเพื่อทำ AHP Analysis (ราคาประเมิน, ราคาเริ่มต้น, ทำเล, ขนาด, สถานะทรัพย์)"
    }
  });
  
  return response.text || '# Error generating LED spider';
};

/**
 * วิเคราะห์ข้อมูลจำนวนมาก (Mass Data) แยกรายจังหวัด
 */
export const analyzeProvincialBreakdown = async (totalItems: number, intent: string) => {
  const ai = getAI();
  const prompt = `Perform a provincial distribution analysis for ${totalItems} LED property items based on the intent: ${intent}. 
  Group the items by province and estimate where the most profitable opportunities lie.
  Return a JSON object with:
  - top_provinces: Array of {province, count, avg_gap, ahp_potential_score}
  - market_insight: A summary of why certain provinces are trending in LED auctions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          top_provinces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                province: { type: Type.STRING },
                count: { type: Type.NUMBER },
                avg_gap: { type: Type.NUMBER },
                ahp_potential_score: { type: Type.NUMBER }
              }
            }
          },
          market_insight: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

/**
 * สร้างข้อมูลตัวอย่างทรัพย์ LED สำหรับ AHP
 */
export const generateMockResults = async (spiderCode: string, intent: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 realistic LED property records for AHP analysis based on: ${intent}. Include: property_id, appraisal_value, start_price, location, property_type. Return as JSON array.`,
    config: {
      responseMimeType: 'application/json',
    }
  });
  return JSON.parse(response.text || '[]');
};

/**
 * วิเคราะห์และคำนวณคะแนน AHP (Analytic Hierarchy Process) ด้วย AI
 */
export const calculateAHPScores = async (intent: string, data: any[]) => {
  const ai = getAI();
  const dataSummary = JSON.stringify(data);
  const prompt = `Calculate AHP scores (0.0 to 10.0) for these LED properties based on intent: ${intent}. 
  Data: ${dataSummary}. 
  Criteria Weights: Price Gap (50%), Location Potential (30%), Property Status (20%). 
  Return JSON array of objects with keys: id, score, reasoning.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

/**
 * ปรับปรุง Spider ตามสถานการณ์ตลาดอสังหาฯ
 */
export const refactorSpider = async (currentCode: string, logs: string, intent: string, saveToDrive: boolean = false) => {
  const ai = getAI();
  const prompt = `Refactor this LED Property Spider. Fix selectors or add drive integration. Intent: ${intent}. Logs: ${logs}. Current Code: ${currentCode}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "คุณคือผู้เชี่ยวชาญการแก้ไข Spider สำหรับเวปอสังหาฯ กรมบังคับคดี"
    }
  });

  return response.text || currentCode;
};

/**
 * วิเคราะห์เชิงกลยุทธ์สำหรับทรัพย์ที่มีศักยภาพสูง (Strategic Investment Analysis)
 */
export const analyzeStrategicOpportunities = async (assets: any[]) => {
  const ai = getAI();
  const assetSummary = JSON.stringify(assets.map(a => ({ id: a.id, loc: a.location, gap: a.gap, type: a.type })));
  
  const prompt = `Analyze these top-ranked LED assets for investment potential: ${assetSummary}. 
  Perform a SWOT analysis for each location using Google Search to find recent news (infrastructure, new factories, flood risks). 
  Suggest a specific bidding strategy for each (e.g., skip first round, bid at 80%).
  Format the response clearly with sections for Market Pulse, SWOT, and Recommendations.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "คุณคือ AI ที่ปรึกษาการลงทุนอสังหาริมทรัพย์มืออาชีพ เชี่ยวชาญทรัพย์กรมบังคับคดี ใช้ข้อมูลจริงจาก Google Search เพื่อประกอบการตัดสินใจ"
    }
  });

  return {
    text: response.text || 'ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้',
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const analyzeLog = async (logs: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze these Scrapy system logs and identify any issues, bottlenecks, or anti-bot detections. Suggest specific technical fixes. If there are HTTP errors, search for recent site changes or Scrapy solutions. Logs:\n${logs}`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 16384 }
    }
  });

  return {
    text: response.text || 'No analysis available.',
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const chatWithSearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  return {
    text: response.text || 'I could not retrieve information at this time.',
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const startChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "คุณคือ AI ผู้เชี่ยวชาญการลงทุนทรัพย์กรมบังคับคดี (LED Investment Assistant) ช่วยวิเคราะห์ทรัพย์และเขียน Scrapy เพื่อหาโอกาสลงทุนที่ดีที่สุดด้วยหลักการ AHP",
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
};
