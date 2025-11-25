import { GoogleGenAI, Type } from "@google/genai";
import { DrinkType, DrinkAnalysisResult } from '../types';

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeDrinkImage = async (base64Data: string, mimeType: string): Promise<DrinkAnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: `Analyze this image of an alcoholic beverage. 
            Identify the brand name, the type of alcohol (Beer, Wine, Liquor, Mixed Drink, Other), 
            the volume in Ounces (oz), and the ABV percentage.
            If you cannot see the volume or ABV on the label, estimate based on standard container sizes for that type of drink.
            If the image is not of a drink, return "Unknown" for name.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Brand name or description of the drink" },
            type: { 
              type: Type.STRING, 
              enum: [DrinkType.BEER, DrinkType.WINE, DrinkType.LIQUOR, DrinkType.MIXED, DrinkType.OTHER],
              description: "Category of the alcohol"
            },
            volumeOz: { type: Type.NUMBER, description: "Volume in fluid ounces (oz)" },
            abv: { type: Type.NUMBER, description: "Alcohol by Volume percentage (e.g. 5.0 for 5%)" },
            confidence: { type: Type.STRING, enum: ["high", "medium", "low"], description: "Confidence in the identification" }
          },
          required: ["name", "type", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as DrinkAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Failed to analyze image. Please try manually.");
  }
};
