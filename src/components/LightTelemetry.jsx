import React from 'react';
import { Thermometer, MapPin, AlertTriangle, Info } from 'lucide-react';

export default function LightTelemetry({ currentTemp, targetTemp, etaMins, isAlert }) {
  const tempStatusColor = isAlert ? 'text-rose-500' : 'text-emerald-400';
  const tempBgColor = isAlert ? 'bg-rose-500/10' : 'bg-emerald-500/10';

  return (
    <div className="bg-brand-card rounded-xl p-6 border border-slate-800 shadow-xl h-full flex flex-col">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
        <Thermometer className="text-brand-primary" size={20} /> Telemetria Lean & ETA
      </h2>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Termômetro */}
        <div className={`rounded-xl p-4 flex flex-col justify-center items-center text-center border ${isAlert ? 'border-rose-500/50' : 'border-slate-700'} ${tempBgColor}`}>
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Temperatura Interna</div>
          <div className={`text-4xl font-bold font-['JetBrains_Mono'] ${tempStatusColor}`}>
            {currentTemp.toFixed(1)}°C
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Alvo Ideal: {targetTemp.min}°C a {targetTemp.max}°C
          </div>
          {isAlert && (
            <div className="mt-3 text-xs text-rose-400 flex items-center justify-center gap-1 bg-rose-900/40 px-2 py-1 rounded">
              <AlertTriangle size={12} /> Alerta: Perda de Crocância!
            </div>
          )}
        </div>

        {/* ETA & GPS */}
        <div className="rounded-xl p-4 flex flex-col justify-center items-center text-center border border-slate-700 bg-slate-800/30">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold flex items-center justify-center gap-1">
            <MapPin size={12} /> Previsão (ETA)
          </div>
          <div className="text-4xl font-bold font-['JetBrains_Mono'] text-brand-secondary">
            {etaMins}m
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Tempo restante para a próxima filial
          </div>
          
          <div className="mt-3 text-[10px] text-slate-400 flex items-center justify-center gap-1 bg-slate-800 px-2 py-1 rounded">
            <Info size={10} /> Baseado no App do Motorista
          </div>
        </div>
      </div>
    </div>
  );
}
