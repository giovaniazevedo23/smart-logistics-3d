import React from 'react';
import { CloudRain, Sun, Wind, Navigation, AlertTriangle, Cpu } from 'lucide-react';

const AI_DATA = [
  { 
    node: 0, 
    weather: { icon: Sun, text: 'Ensolarado', temp: '32°C' }, 
    traffic: 'Livre', 
    risk: 'Baixo',
    msg: 'Condições ideais para expedição no CD.'
  },
  { 
    node: 1, 
    weather: { icon: Sun, text: 'Ensolarado', temp: '34°C' }, 
    traffic: 'Moderado', 
    risk: 'Baixo',
    msg: 'Tráfego fluindo bem na Av. Miguel Rosa.'
  },
  { 
    node: 2, 
    weather: { icon: CloudRain, text: 'Chuva Leve', temp: '26°C' }, 
    traffic: 'Intenso', 
    risk: 'Médio',
    msg: 'Chuva na Zona Leste. Possível lentidão na Av. João XXIII.'
  },
  { 
    node: 3, 
    weather: { icon: Wind, text: 'Nublado/Ventos', temp: '28°C' }, 
    traffic: 'Livre', 
    risk: 'Baixo',
    msg: 'Acesso à Zona Norte liberado e rápido.'
  },
  { 
    node: 4, 
    weather: { icon: Sun, text: 'Quente', temp: '35°C' }, 
    traffic: 'Intenso', 
    risk: 'Alto',
    msg: 'Trânsito pesado na Zona Sudeste. Risco térmico elevado (35°C).'
  },
];

export default function AiContextPanel({ currentNodeIndex }) {
  const currentData = AI_DATA[currentNodeIndex];
  const WeatherIcon = currentData.weather.icon;

  return (
    <div className="bg-slate-900 border border-brand-secondary/30 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-6 animate-fade-in relative overflow-hidden">
      
      {/* Background glow for AI feel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg border border-slate-700 w-full md:w-auto">
        <div className="flex items-center gap-2 text-brand-secondary font-bold mb-1">
          <Cpu size={18} /> IA Operacional
        </div>
        <span className="text-xs text-slate-400">Análise de Contexto</span>
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 mb-1">Clima Atual</span>
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <WeatherIcon size={16} className={currentData.weather.text.includes('Chuva') ? 'text-blue-400' : 'text-amber-400'} />
            {currentData.weather.text} ({currentData.weather.temp})
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400 mb-1">Tráfego</span>
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Navigation size={16} className={currentData.traffic === 'Livre' ? 'text-emerald-400' : currentData.traffic === 'Moderado' ? 'text-amber-400' : 'text-rose-400'} />
            {currentData.traffic}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400 mb-1">Risco de Atraso</span>
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <AlertTriangle size={16} className={currentData.risk === 'Baixo' ? 'text-emerald-400' : currentData.risk === 'Médio' ? 'text-amber-400' : 'text-rose-400'} />
            {currentData.risk}
          </div>
        </div>
        
        <div className="flex flex-col col-span-2 md:col-span-1">
           <span className="text-xs text-slate-400 mb-1">Insight Preditivo</span>
           <p className="text-xs text-slate-300 leading-tight italic border-l-2 border-brand-secondary pl-2">
             "{currentData.msg}"
           </p>
        </div>
      </div>
    </div>
  );
}
