
import { UserInputs, CalculationResult, Orientation, Material, Recommendation } from '../types';
import { U_VALUES, DEFAULT_ADVICE } from '../constants';

/**
 * Motor de Cálculo Termodinámico Simplificado
 */
export const calculateThermalLoad = (inputs: UserInputs): CalculationResult => {
  const { materials, orientation, areaSqm, appliances } = inputs;

  // 1. Cálculo de Transmitancia (U)
  const uValue = U_VALUES[materials];
  
  // 2. Factor Solar (Basado en Orientación)
  // En hemisferio norte: Sur recibe más sol. En hemisferio sur: Norte.
  // Asumimos lógica general de carga solar por orientación:
  let solarFactor = 1.0;
  if (orientation === Orientation.West) solarFactor = 1.4; // Sol de tarde es más agresivo
  if (orientation === Orientation.East) solarFactor = 1.2;
  if (orientation === Orientation.North) solarFactor = 1.3;
  if (orientation === Orientation.South) solarFactor = 0.9;

  // 3. Carga Térmica Estimada (W/m2) - Modelo simplificado
  // Base: 50W/m2 como neutro
  const thermalLoad = (uValue * 15) * solarFactor;

  // 4. Eficiencia de Electrodomésticos (Vampiros)
  const totalWatts = appliances.reduce((sum, app) => {
    let multiplier = 1.0;
    if (app.efficiency === 'Old' || app.efficiency === 'D') multiplier = 1.8;
    return sum + (app.powerWatts * multiplier * (app.hoursPerDay / 24));
  }, 0);

  // 5. Puntaje de Eficiencia (0 a 100)
  // Penalizamos U-Values altos y cargas solares mal gestionadas
  const materialScore = Math.max(0, 100 - (uValue * 20));
  const solarScore = Math.max(0, 100 - (solarFactor * 25));
  const applianceScore = Math.max(0, 100 - (totalWatts / areaSqm * 2));
  
  const efficiencyScore = Math.round((materialScore * 0.4) + (solarScore * 0.3) + (applianceScore * 0.3));

  // 6. Ahorro Potencial
  // Estimamos un 30-50% de ahorro si se siguen recomendaciones
  const potentialSavings = inputs.monthlyBill * (0.15 + (100 - efficiencyScore) / 200);

  // Filtrar recomendaciones relevantes
  const recommendations: Recommendation[] = [...DEFAULT_ADVICE];
  if (orientation === Orientation.West || orientation === Orientation.East) {
    recommendations.push({
      title: "Control Solar Dinámico",
      description: "Instalar persianas exteriores o toldos para las horas pico de radiación lateral.",
      category: "Structural",
      impact: "High"
    });
  }

  return {
    efficiencyScore,
    thermalLoadEstimate: thermalLoad,
    potentialSavings,
    solarGainLevel: solarFactor > 1.2 ? 'High' : solarFactor > 1.0 ? 'Medium' : 'Low',
    recommendations: recommendations.slice(0, 6)
  };
};
