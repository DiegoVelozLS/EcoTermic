
import { UserInputs, CalculationResult, Orientation, Material, Recommendation } from '../types';
import { U_VALUES } from '../constants';

export const calculateThermalLoad = (inputs: UserInputs): CalculationResult => {
  const { materials, orientation, areaSqm, appliances, monthlyBill } = inputs;

  // Cálculo simplificado de cuánto afecta el clima/casa vs aparatos
  const uValue = U_VALUES[materials] || 2.0;
  let solarFactor = 1.0;
  if (orientation === Orientation.West) solarFactor = 1.5; 
  if (orientation === Orientation.East) solarFactor = 1.2;

  const structuralExpenseBase = (uValue * solarFactor * 10);
  const operationalWatts = appliances.reduce((sum, app) => sum + (app.powerWatts * (app.hoursPerDay / 24)), 0);
  const operationalExpenseBase = operationalWatts / (areaSqm || 1);

  const totalBase = structuralExpenseBase + operationalExpenseBase;
  const efficiencyScore = Math.max(10, Math.min(95, 100 - (totalBase / 2)));
  
  // Ahorro estimado basado en corregir malos hábitos
  const potentialSavings = monthlyBill * 0.35; 

  // LOS 10 TIPS PRÁCTICOS (Directos y sin palabras raras)
  const recommendations: Recommendation[] = [
    {
      title: "El 'Efecto Cueva' con cortinas",
      description: "Cierra cortinas donde pegue el sol directo. Evita que el sol caliente el piso y las paredes para que el aire trabaje menos.",
      category: "Habit",
      impact: "High",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Pon el Aire en 24°C",
      description: "No lo pongas en 18°C para 'enfriar rápido', es un mito. 24°C es el punto perfecto para que tu bolsillo no sufra.",
      category: "Habit",
      impact: "High",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Combo: Aire + Ventilador",
      description: "Usa el ventilador junto al aire. Ayuda a mover el frío más rápido y puedes subirle 2 grados al aire sin perder frescura.",
      category: "Habit",
      impact: "Medium",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Lava los filtros del Aire",
      description: "Si el filtro tiene polvo, el motor se esfuerza el doble. Lávalos cada 15 días, es gratis y baja el consumo de una.",
      category: "Habit",
      impact: "High",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Refrigeradora: Cierra rápido",
      description: "No te quedes pensando con la puerta abierta. Revisa que los cauchos sellen bien atrapando un papel en la puerta.",
      category: "Habit",
      impact: "Medium",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Ventilación Cruzada (6:30 PM)",
      description: "Cuando baje el sol, abre ventanas opuestas para que corra aire. Eso te ahorra un par de horas de aire acondicionado.",
      category: "Habit",
      impact: "Medium",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Cámbiate a focos LED",
      description: "Los focos amarillos o de espiral calientan y gastan mucho. El LED no calienta nada y casi no consume vatios.",
      category: "Technological",
      impact: "High",
      estimatedCost: 50,
      paybackMonths: 2
    },
    {
      title: "Desconecta los 'Vampiros'",
      description: "Cargadores, microondas y laptops gastan luz aunque estén apagados. Desconéctalos y ahorra hasta un 10% de tu planilla.",
      category: "Habit",
      impact: "Medium",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Lavadora siempre llena",
      description: "Usa la lavadora solo con carga completa y evita el agua caliente si no es urgente. Calentar agua es carísimo.",
      category: "Habit",
      impact: "Medium",
      estimatedCost: 0,
      paybackMonths: 0
    },
    {
      title: "Pinta tu casa de blanco",
      description: "Si puedes, pinta el techo y paredes exteriores de blanco. Refleja el calor y baja la temperatura adentro hasta 3 grados.",
      category: "Structural",
      impact: "High",
      estimatedCost: 200,
      paybackMonths: 12
    }
  ];

  return {
    efficiencyScore,
    structuralLoad: structuralExpenseBase,
    operationalLoad: operationalExpenseBase,
    totalLoadEstimate: totalBase,
    potentialSavings,
    solarGainLevel: solarFactor > 1.2 ? 'High' : 'Low',
    recommendations,
    roiYears: 1.5
  };
};
