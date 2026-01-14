
export enum Orientation {
  North = 'Norte',
  South = 'Sur',
  East = 'Este',
  West = 'Oeste'
}

export enum Material {
  Concrete = 'Concreto',
  Brick = 'Ladrillo',
  Wood = 'Madera',
  SingleGlass = 'Vidrio Simple',
  DoubleGlass = 'Vidrio Doble'
}

export interface Appliance {
  id: string;
  name: string;
  powerWatts: number;
  hoursPerDay: number;
  efficiency: 'A' | 'B' | 'C' | 'D' | 'Old';
}

export interface UserInputs {
  location: string;
  materials: Material;
  orientation: Orientation;
  monthlyBill: number;
  areaSqm: number;
  appliances: Appliance[];
}

export interface CalculationResult {
  efficiencyScore: number;
  thermalLoadEstimate: number; // Watts per sqm
  potentialSavings: number;
  solarGainLevel: 'Low' | 'Medium' | 'High';
  recommendations: Recommendation[];
}

export interface Recommendation {
  title: string;
  description: string;
  category: 'Structural' | 'Technological' | 'Habit';
  impact: 'High' | 'Medium' | 'Low';
}
