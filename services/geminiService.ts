
import { GoogleGenAI } from "@google/genai";
import { UserInputs, CalculationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIExpertAdvice = async (inputs: UserInputs, results: CalculationResult): Promise<string> => {
  try {
    const prompt = `
      Actúa como un experto en eficiencia energética residencial.
      Contexto de la casa:
      - Ubicación: ${inputs.location}
      - Orientación: ${inputs.orientation}
      - Material principal: ${inputs.materials}
      - Puntaje de eficiencia actual: ${results.efficiencyScore}/100
      - Carga térmica estimada: ${results.thermalLoadEstimate.toFixed(2)} W/m²
      - Gasto mensual: $${inputs.monthlyBill}
      - Electrodomésticos críticos: ${inputs.appliances.map(a => a.name).join(', ')}

      Proporciona un análisis breve (máximo 200 palabras) sobre por qué la casa gasta tanto y 2 consejos técnicos ultra-específicos (de termodinámica aplicada) para mejorar el confort térmico sin usar paneles solares. 
      Habla de transferencia de calor por conducción, convección o radiación según el caso.
      Formato: Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No se pudo generar el consejo experto en este momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con el consultor energético AI.";
  }
};
