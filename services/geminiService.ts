import { GoogleGenAI, Type } from "@google/genai";
import { MODEL_NAME, SYSTEM_PROMPT } from '../constants';
import { AgencyResult } from '../types';

export const classifySituation = async (input: string): Promise<AgencyResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Define the schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      classification: {
        type: Type.OBJECT,
        properties: {
          my_domain: { type: Type.INTEGER },
          others_domain: { type: Type.INTEGER },
          life_domain: { type: Type.INTEGER },
        },
        required: ["my_domain", "others_domain", "life_domain"],
      },
      dominant_domain: {
        type: Type.STRING,
        enum: ["我的事", "別人的事", "天的事"],
      },
      one_sentence_reason: { type: Type.STRING },
      recommended_action: { type: Type.STRING },
      optional_reframe: { type: Type.STRING },
    },
    required: ["classification", "dominant_domain", "one_sentence_reason", "recommended_action", "optional_reframe"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: input,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    const parsedResult = JSON.parse(text) as AgencyResult;
    return parsedResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};