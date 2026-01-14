
import React, { useState, useMemo } from 'react';
import { 
  Thermometer, 
  Zap, 
  Home, 
  Info, 
  TrendingDown, 
  ChevronRight, 
  AlertTriangle,
  Lightbulb,
  Plus,
  Trash2,
  BrainCircuit,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { UserInputs, Material, Orientation, CalculationResult, Appliance } from './types';
import { calculateThermalLoad } from './services/physics';
import { getAIExpertAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  
  const [inputs, setInputs] = useState<UserInputs>({
    location: '',
    materials: Material.Concrete,
    orientation: Orientation.North,
    monthlyBill: 100,
    areaSqm: 80,
    appliances: []
  });

  const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({
    name: '',
    powerWatts: 0,
    hoursPerDay: 0,
    efficiency: 'B'
  });

  const results = useMemo(() => calculateThermalLoad(inputs), [inputs]);

  const handleAddAppliance = () => {
    if (newAppliance.name && newAppliance.powerWatts) {
      const app: Appliance = {
        id: Math.random().toString(36).substr(2, 9),
        name: newAppliance.name!,
        powerWatts: Number(newAppliance.powerWatts),
        hoursPerDay: Number(newAppliance.hoursPerDay || 0),
        efficiency: (newAppliance.efficiency as any) || 'B'
      };
      setInputs(prev => ({ ...prev, appliances: [...prev.appliances, app] }));
      setNewAppliance({ name: '', powerWatts: 0, hoursPerDay: 0, efficiency: 'B' });
    }
  };

  const removeAppliance = (id: string) => {
    setInputs(prev => ({ ...prev, appliances: prev.appliances.filter(a => a.id !== id) }));
  };

  const handleSimulate = async () => {
    setIsAnalyzing(true);
    setStep('results');
    const advice = await getAIExpertAdvice(inputs, results);
    setAiAnalysis(advice);
    setIsAnalyzing(false);
  };

  const chartData = [
    { name: 'Actual', costo: inputs.monthlyBill, color: '#ef4444' },
    { name: 'Optimizado', costo: Math.max(inputs.monthlyBill - results.potentialSavings, 0), color: '#22c55e' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Thermometer className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">EcoTermic</h1>
              <p className="text-xs text-slate-500 font-medium">Simulador de Confort y Ahorro</p>
            </div>
          </div>
          {step === 'results' && (
            <button 
              onClick={() => setStep('form')}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Editar Datos
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        {step === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  Características de la Vivienda
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación (Ciudad)</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Madrid, CDMX, Santiago..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={inputs.location}
                      onChange={e => setInputs({...inputs, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Área (m²)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={inputs.areaSqm}
                      onChange={e => setInputs({...inputs, areaSqm: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Material Predominante</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={inputs.materials}
                      onChange={e => setInputs({...inputs, materials: e.target.value as Material})}
                    >
                      {Object.values(Material).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Orientación Fachada Principal</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={inputs.orientation}
                      onChange={e => setInputs({...inputs, orientation: e.target.value as Orientation})}
                    >
                      {Object.values(Orientation).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Equipos de Alto Consumo
                </h2>
                
                <div className="space-y-4 mb-6">
                  {inputs.appliances.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{app.name}</p>
                        <p className="text-xs text-slate-500">{app.powerWatts}W • {app.hoursPerDay}h/día • Eficiencia: {app.efficiency}</p>
                      </div>
                      <button onClick={() => removeAppliance(app.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Equipo</label>
                    <input 
                      type="text" 
                      placeholder="Nombre"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      value={newAppliance.name}
                      onChange={e => setNewAppliance({...newAppliance, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Watts</label>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      value={newAppliance.powerWatts || ''}
                      onChange={e => setNewAppliance({...newAppliance, powerWatts: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Horas/Día</label>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      value={newAppliance.hoursPerDay || ''}
                      onChange={e => setNewAppliance({...newAppliance, hoursPerDay: Number(e.target.value)})}
                    />
                  </div>
                  <button 
                    onClick={handleAddAppliance}
                    className="bg-slate-800 text-white p-2 rounded-lg flex items-center justify-center gap-1 font-bold text-sm"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
              </section>
            </div>

            {/* Sticky Sidebar */}
            <div className="space-y-6">
              <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
                <h3 className="text-2xl font-bold mb-4">¿Listo para simular?</h3>
                <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                  Usaremos leyes de la termodinámica para estimar cuánto calor gana tu hogar y cómo optimizar tu gasto eléctrico sin paneles solares.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <div className="bg-emerald-800/50 p-2 rounded-lg h-fit"><Info className="w-4 h-4" /></div>
                    <p className="text-xs text-emerald-200">Analizaremos la transmitancia térmica (U-Value) de tus materiales.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-emerald-800/50 p-2 rounded-lg h-fit"><TrendingDown className="w-4 h-4" /></div>
                    <p className="text-xs text-emerald-200">Calcularemos el potencial de ahorro real con mejoras pasivas.</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider">Factura Eléctrica Mensual ($)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-emerald-800/30 border border-emerald-700/50 rounded-2xl text-2xl font-bold outline-none text-white focus:ring-2 focus:ring-emerald-400"
                    value={inputs.monthlyBill}
                    onChange={e => setInputs({...inputs, monthlyBill: Number(e.target.value)})}
                  />
                </div>

                <button 
                  onClick={handleSimulate}
                  className="w-full bg-white text-emerald-900 p-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
                >
                  Comenzar Simulación <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Score Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Eficiencia Energética</p>
                <div className={`text-6xl font-black mb-4 ${results.efficiencyScore > 70 ? 'text-emerald-500' : results.efficiencyScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                  {results.efficiencyScore}%
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {results.efficiencyScore > 70 
                    ? "Tu hogar tiene un buen desempeño térmico inicial." 
                    : "Existen fugas críticas de energía y calor en tu estructura."}
                </p>
              </div>

              {/* Thermal Load */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-xl"><Thermometer className="text-orange-600 w-5 h-5" /></div>
                  <h3 className="font-bold text-slate-800">Carga Térmica</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-500">Estimación:</span>
                    <span className="text-2xl font-bold text-slate-800">{results.thermalLoadEstimate.toFixed(1)} <span className="text-sm font-normal text-slate-400">W/m²</span></span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: `${Math.min(100, (results.thermalLoadEstimate / 100) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 italic">Basado en transmitancia térmica del {inputs.materials} y ganancia solar por orientación {inputs.orientation}.</p>
                </div>
              </div>

              {/* Savings Card */}
              <div className="bg-emerald-500 p-8 rounded-3xl text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
                <TrendingDown className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-400/30 rotate-12" />
                <h3 className="font-bold mb-1 opacity-90">Ahorro Mensual Estimado</h3>
                <div className="text-4xl font-black mb-4">
                  ${results.potentialSavings.toFixed(2)}
                </div>
                <p className="text-sm text-emerald-50 font-medium leading-relaxed">
                  Podrías reducir tu factura un <b>{((results.potentialSavings / inputs.monthlyBill) * 100).toFixed(0)}%</b> aplicando técnicas de diseño pasivo y optimización de equipos.
                </p>
              </div>
            </div>

            {/* AI Insights & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expert Advice AI */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden border border-slate-800">
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-emerald-500 p-2 rounded-lg"><BrainCircuit className="w-5 h-5 text-white" /></div>
                  <h3 className="font-bold text-xl">Análisis del Experto AI</h3>
                </div>
                
                {isAnalyzing ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
                    {aiAnalysis}
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lógica: Física Térmica y Radiación Solar</p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   Impacto en Factura Eléctrica
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="costo" radius={[10, 10, 10, 10]} barSize={60}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                   <AlertTriangle className="text-amber-500 w-5 h-5" />
                   <p className="text-xs text-slate-600 leading-tight">
                     <b>Dato Crítico:</b> El calor absorbido por paredes de {inputs.materials} en orientación {inputs.orientation} obliga a tu climatización a trabajar un <b>{((1.4 - (results.efficiencyScore/100))*20).toFixed(0)}% más</b> de lo necesario.
                   </p>
                </div>
              </div>
            </div>

            {/* List of Specific Recommendations */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 px-2">Hoja de Ruta de Optimización</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.recommendations.map((rec, i) => (
                  <div key={i} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-xl ${rec.category === 'Structural' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        {rec.category === 'Structural' ? <Home className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${rec.impact === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                        Impacto {rec.impact}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{rec.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{rec.description}</p>
                    <div className="h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-medium italic">"La energía más barata es la que no se consume."</p>
          <div className="mt-4 flex justify-center gap-6">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Dinámica de Fluídos</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Resistencia Térmica</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Gestión de Red</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
