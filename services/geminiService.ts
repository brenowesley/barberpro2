import { GoogleGenAI } from "@google/genai";

// Initialize the client.
// In a real app, ensure process.env.API_KEY is handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBusinessAdvice = async (
  topic: string,
  context: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expert business coach for hairdressers and barbers.
      Context: ${context}
      
      Please provide short, actionable advice on the following topic: "${topic}".
      Keep it under 100 words and use a motivating tone.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Service is currently unavailable. Please check your API Key.";
  }
};

export const generateServiceDescription = async (
  serviceName: string,
  price: number
): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `Write a catchy, professional 1-sentence description for a salon service named "${serviceName}" that costs $${price}.`;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        return response.text || "Professional styling service.";
    } catch (error) {
        return "Professional styling service.";
    }
}