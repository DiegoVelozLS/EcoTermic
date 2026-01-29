
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

export interface Recommendation {
  title: string;
  description: string;
  category: 'Structural' | 'Technological' | 'Habit';
  impact: 'High' | 'Medium' | 'Low';
  estimatedCost: number; // In USD
  paybackMonths: number;
}

export interface CalculationResult {
  efficiencyScore: number;
  structuralLoad: number; // Watts due to building envelope
  operationalLoad: number; // Watts due to appliances
  totalLoadEstimate: number; // Total W/sqm
  potentialSavings: number;
  solarGainLevel: 'Low' | 'Medium' | 'High';
  recommendations: Recommendation[];
  roiYears: number;
}
