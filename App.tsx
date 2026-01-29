
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Home, 
  ChevronRight, 
  Plus, 
  Trash2, 
  BrainCircuit, 
  ArrowLeft, 
  Leaf, 
  Lightbulb,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell as ReCell
} from 'recharts';

import { UserInputs, Material, Orientation, Appliance } from './types';
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
    areaSqm: 60,
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
    if (!inputs.location) {
      alert("Dinos tu ciudad para saber cuánto te cuesta la luz ahí.");
      return;
    }
    setIsAnalyzing(true);
    setStep('results');
    const advice = await getAIExpertAdvice(inputs, results);
    setAiAnalysis(advice);
    setIsAnalyzing(false);
  };

  const breakdownData = [
    { name: 'Gasto por el sol/casa', value: results.structuralLoad, color: '#10b981' },
    { name: 'Gasto por aparatos prendidos', value: results.operationalLoad, color: '#84cc16' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-slate-900">
      <header className="bg-emerald-900 sticky top-0 z-50 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-400 w-6 h-6 fill-current" />
            <h1 className="text-lg font-bold uppercase tracking-tight italic underline decoration-emerald-400">Paga Menos Luz</h1>
          </div>
          {step === 'results' && (
            <button onClick={() => setStep('form')} className="text-xs font-bold px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Volver
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-8">
        {step === 'form' ? (
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-emerald-950 leading-none">¿Cansado de facturas caras?</h2>
              <p className="text-emerald-800/70 font-bold uppercase text-[10px] tracking-widest">Dinos qué usas y te diremos cómo ahorrar</p>
            </div>

            {/* Dónde vives */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-emerald-100">
              <h3 className="font-black text-emerald-950 text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-500" /> 1. ¿Dónde vives?
              </h3>
              <input 
                type="text" 
                placeholder="Ej: Guayaquil, CDMX, Lima..." 
                className="w-full p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-emerald-900 text-lg"
                value={inputs.location}
                onChange={e => setInputs({...inputs, location: e.target.value})}
              />
            </div>

            {/* Tu casa */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-emerald-50">
              <h3 className="font-black text-emerald-950 text-xl mb-6 flex items-center gap-2">
                <Home className="w-6 h-6 text-emerald-500" /> 2. Tu casa
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">¿De qué son tus paredes?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[Material.Concrete, Material.Brick, Material.Wood].map(m => (
                      <button 
                        key={m}
                        onClick={() => setInputs({...inputs, materials: m})}
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${inputs.materials === m ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                      >
                        {m === Material.Concrete ? 'Cemento' : m === Material.Brick ? 'Ladrillo' : 'Madera'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">¿Dónde pega el sol fuerte?</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={inputs.orientation} onChange={e => setInputs({...inputs, orientation: e.target.value as Orientation})}>
                    <option value={Orientation.West}>Oeste (Sol de la tarde)</option>
                    <option value={Orientation.East}>Este (Sol de la mañana)</option>
                    <option value={Orientation.North}>Norte (Sombra)</option>
                    <option value={Orientation.South}>Sur (Templado)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Aparatos */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-emerald-50">
              <h3 className="font-black text-emerald-950 text-xl mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-lime-500" /> 3. Tus aparatos
              </h3>
              <div className="space-y-3 mb-6">
                {inputs.appliances.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 w-2 h-2 rounded-full" />
                      <div>
                        <p className="font-black text-emerald-950">{app.name}</p>
                        <p className="text-xs text-emerald-700 font-bold">{app.hoursPerDay}h prendido al día</p>
                      </div>
                    </div>
                    <button onClick={() => removeAppliance(app.id)} className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl space-y-4">
                <input type="text" placeholder="¿Qué aparato es? (Ej: Aire)" className="w-full p-4 bg-white rounded-xl text-sm font-bold border-none outline-none" value={newAppliance.name} onChange={e => setNewAppliance({...newAppliance, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                   <input type="number" placeholder="Watts" className="p-4 bg-white rounded-xl text-sm font-bold border-none outline-none" value={newAppliance.powerWatts || ''} onChange={e => setNewAppliance({...newAppliance, powerWatts: Number(e.target.value)})} />
                   <input type="number" placeholder="Horas/día" className="p-4 bg-white rounded-xl text-sm font-bold border-none outline-none" value={newAppliance.hoursPerDay || ''} onChange={e => setNewAppliance({...newAppliance, hoursPerDay: Number(e.target.value)})} />
                </div>
                <button onClick={handleAddAppliance} className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg">
                  <Plus className="w-5 h-5" /> Agregar Aparato
                </button>
              </div>
            </div>

            {/* Dinero */}
            <div className="bg-emerald-950 p-10 rounded-[2.5rem] text-white shadow-2xl">
               <div className="flex flex-col items-center gap-6">
                  <h3 className="text-xl font-black text-center">¿Cuánto pagaste de luz este mes?</h3>
                  <div className="flex items-center gap-4 bg-white/10 p-6 rounded-[2rem] border border-white/10 w-full justify-center">
                    <span className="text-4xl font-black text-emerald-400">$</span>
                    <input type="number" className="bg-transparent text-5xl font-black w-32 outline-none text-center" value={inputs.monthlyBill} onChange={e => setInputs({...inputs, monthlyBill: Number(e.target.value)})} />
                  </div>
                  <button onClick={handleSimulate} className="w-full bg-emerald-400 text-emerald-950 py-5 rounded-2xl font-black text-xl uppercase hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2">
                    ¡Dime cómo ahorrar! <ChevronRight className="w-6 h-6" />
                  </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Cabecera Ahorro */}
            <div className="bg-emerald-500 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign className="w-32 h-32" /></div>
                <p className="text-sm font-black uppercase tracking-[0.2em] mb-4">Con mis trucos vas a ahorrar:</p>
                <div className="text-8xl font-black mb-4 tracking-tighter">${results.potentialSavings.toFixed(0)}</div>
                <p className="text-xl font-bold uppercase">¡Casi un tercio de tu recibo!</p>
            </div>

            {/* El veredicto de la IA */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-emerald-100 p-4 rounded-3xl text-emerald-600">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-emerald-950 leading-none">Mi diagnóstico para {inputs.location}</h3>
                  <p className="text-[10px] font-black text-emerald-400 uppercase mt-1">Directo y al grano</p>
                </div>
              </div>
              {isAnalyzing ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-emerald-50 rounded-full w-3/4"></div>
                  <div className="h-4 bg-emerald-50 rounded-full w-full"></div>
                </div>
              ) : (
                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 text-emerald-900 leading-relaxed text-xl font-bold italic">
                  "{aiAnalysis}"
                </div>
              )}
            </div>

            {/* LOS 10 TIPS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="text-amber-400 w-8 h-8 fill-current" />
                <h3 className="text-3xl font-black text-emerald-950">10 Tips para ahorrar YA</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-50 hover:border-emerald-500 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-emerald-950 text-xl mb-2 group-hover:text-emerald-600 transition-colors">{rec.title}</h4>
                        <p className="text-slate-600 font-medium leading-tight">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-emerald-950 py-12 mt-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
           <p className="text-emerald-700 font-black text-xs uppercase tracking-[0.4em]">Calculadora de Ahorro Directo</p>
           <p className="text-emerald-800 text-[10px] mt-4 font-bold">Hecha para que dejes de tirar dinero en {inputs.location || 'tu ciudad'}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
