
import { Material, Recommendation } from './types';

// Transmitancia Térmica Simplificada (U-Value: W/m²K)
export const U_VALUES: Record<Material, number> = {
  [Material.Concrete]: 3.2,
  [Material.Brick]: 2.1,
  [Material.Wood]: 0.6,
  [Material.SingleGlass]: 5.7,
  [Material.DoubleGlass]: 2.8,
};

export const DEFAULT_ADVICE: Recommendation[] = [
  {
    title: "Pintar techo de blanco",
    description: "Refleja hasta el 80% de la radiación solar, reduciendo la temperatura interior hasta 4°C en verano.",
    category: "Structural",
    impact: "High"
  },
  {
    title: "Aleros y Pérgolas",
    description: "Instalar sombreado exterior en ventanas orientadas al oeste para bloquear el sol de la tarde.",
    category: "Structural",
    impact: "High"
  },
  {
    title: "Migración a LED",
    description: "Reemplazar bombillas incandescentes reduce la carga térmica interna (menos calor residual) y el gasto directo.",
    category: "Technological",
    impact: "Medium"
  },
  {
    title: "Sellado de Rendijas",
    description: "Usa burletes en puertas y ventanas para evitar fugas de aire climatizado (ahorro de hasta un 15%).",
    category: "Structural",
    impact: "Medium"
  },
  {
    title: "Equipos Inverter (A+++)",
    description: "Cambiar aires acondicionados viejos por tecnología Inverter reduce el consumo de climatización en un 40%.",
    category: "Technological",
    impact: "High"
  }
];

export const PRESET_APPLIANCES = [
  { name: 'Aire Acondicionado (Antiguo)', powerWatts: 2500, efficiency: 'Old' },
  { name: 'Calefacción Eléctrica', powerWatts: 2000, efficiency: 'C' },
  { name: 'Refrigeradora (10+ años)', powerWatts: 400, efficiency: 'D' },
  { name: 'Iluminación Halógena', powerWatts: 300, efficiency: 'Old' },
];
