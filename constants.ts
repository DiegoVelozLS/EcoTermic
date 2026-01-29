
import { Material } from './types';

// Transmitancia Térmica Simplificada (U-Value: W/m²K)
export const U_VALUES: Record<Material, number> = {
  [Material.Concrete]: 3.2,
  [Material.Brick]: 2.1,
  [Material.Wood]: 0.6,
  [Material.SingleGlass]: 5.7,
  [Material.DoubleGlass]: 2.8,
};

export const IMPROVEMENT_COSTS = {
  whiteRoof: 250, // USD typical for a small house
  shading: 150,
  ledMigration: 80,
  weatherStripping: 40,
  inverterAC: 800,
  solarFilm: 120
};

export const PRESET_APPLIANCES = [
  { name: 'Aire Acondicionado (Antiguo)', powerWatts: 2500, efficiency: 'Old' },
  { name: 'Calefacción Eléctrica', powerWatts: 2000, efficiency: 'C' },
  { name: 'Refrigeradora (10+ años)', powerWatts: 400, efficiency: 'D' },
  { name: 'Iluminación Halógena', powerWatts: 300, efficiency: 'Old' },
];
