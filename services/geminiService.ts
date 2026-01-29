
import { GoogleGenAI } from "@google/genai";
import { UserInputs, CalculationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIExpertAdvice = async (inputs: UserInputs, results: CalculationResult): Promise<string> => {
  try {
    const appliancesText = inputs.appliances.map(a => `- ${a.name}: ${a.hoursPerDay} horas al día`).join('\n');
    
    const prompt = `
      Eres un consultor experto en ahorro de energía que habla de forma muy humana, cercana y clara. Tu objetivo es explicarle al usuario detalladamente por qué su recibo de luz es tan alto y cómo puede bajarlo.

      CONTEXTO DEL USUARIO:
      - Ciudad: ${inputs.location}.
      - Pago mensual actual: $${inputs.monthlyBill}.
      - Lista de aparatos y uso: 
      ${appliancesText}
      - Material de construcción: ${inputs.materials}.
      - Orientación del sol: ${inputs.orientation}.

      REGLAS CRÍTICAS DE LENGUAJE:
      1. PROHIBIDO usar terminología técnica: No digas termodinámica, vatios, watts, eficiencia, carga térmica, transmitancia ni nada que parezca de un libro de ingeniería.
      2. Habla de DINERO, TIEMPO y ESFUERZO de los aparatos.
      3. Usa analogías simples (como que el dinero se escapa por las ventanas o que el aire está "luchando" contra el sol).

      ESTRUCTURA DEL ANÁLISIS (Hazlo extenso y detallado):
      - Empieza con un saludo personalizado mencionando su ciudad y cómo el clima de ${inputs.location} influye directamente en su gasto.
      - Analiza el impacto de los materiales: Explica cómo vivir en una casa de ${inputs.materials} hace que el calor se quede atrapado o entre más fácil, obligando a sus equipos a trabajar horas extra.
      - Analiza el uso de los aparatos: Sé muy específico con los datos que te dio. Si el usuario tiene un ${inputs.appliances[0]?.name || 'aparato'} por ${inputs.appliances[0]?.hoursPerDay || ''} horas, explícale cuánto dinero representa ese exceso al final del mes.
      - Conexión con el ahorro: Explica detalladamente cuánto dinero (en dólares o moneda local) podría recuperar si tan solo cambiara un par de hábitos, como el de los "vampiros" o el "efecto cueva".
      - Termina con una nota motivadora sobre recuperar el control de su dinero.

      FORMATO: Escribe varios párrafos (mínimo 3). Sé profundo en la explicación pero sencillo en las palabras.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || `En ${inputs.location} estás gastando de más porque dejas tus aparatos prendidos mucho tiempo. ¡Empieza a apagarlos hoy!`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Parece que tu mayor gasto viene del tiempo excesivo que dejas prendidos los equipos de alto consumo. Si reduces tan solo un par de horas el uso del aire y desconectas los aparatos que no usas, verás un cambio inmediato en tu bolsillo.";
  }
};
