import React from 'react';
import { Settings, Plus } from 'lucide-react';

export default function FleetManager({ vehicles, selectedVehicleId, onSelectVehicle }) {
  return (
    <div className="bg-brand-card rounded-xl p-6 border border-slate-800 shadow-xl h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Settings className="text-brand-primary" size={20} /> Gestão de Frota Leve
        </h2>
        <button className="text-brand-secondary hover:text-white transition-colors text-sm flex items-center gap-1">
          <Plus size={16} /> Novo
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {vehicles.map(vehicle => (
          <div 
            key={vehicle.id}
            onClick={() => onSelectVehicle(vehicle.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedVehicleId === vehicle.id 
                ? 'border-brand-primary bg-brand-primary/10' 
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl" style={{ color: vehicle.color }}>{vehicle.icon}</div>
              <div className="flex-1">
                <div className="font-bold">{vehicle.name}</div>
                <div className="text-xs text-slate-400">{vehicle.type}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">Capacidade</div>
                <div className="text-sm font-semibold bg-slate-800 px-2 py-1 rounded text-emerald-400">
                  {vehicle.capacity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
