import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertTriangle } from 'lucide-react';

import BakeryDashboard from './components/BakeryDashboard';
import FleetManager from './components/FleetManager';
import LightTelemetry from './components/LightTelemetry';

import { DELIVERY_NODES, FLEET_VEHICLES, CURRENT_TRIP } from './data/bakeryData';

function App() {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  // steps: waiting -> loading -> transit -> unloading -> waiting (next node)
  const [stepStatus, setStepStatus] = useState('waiting');
  
  const [selectedVehicleId, setSelectedVehicleId] = useState(FLEET_VEHICLES[0].id);
  
  const [currentTemp, setCurrentTemp] = useState(21.5);
  const [etaMins, setEtaMins] = useState(0);
  const [isAlert, setIsAlert] = useState(false);

  // Simulation logic for Temperature and ETA
  useEffect(() => {
    let timer;
    if (stepStatus === 'transit') {
      // Simulate transit dynamics
      timer = setInterval(() => {
        setEtaMins(prev => Math.max(0, prev - 1));
        
        // Temperature fluctuations
        setCurrentTemp(prev => {
          const change = (Math.random() - 0.3) * 0.5; // Tends to increase slightly
          const newTemp = prev + change;
          
          if (newTemp > CURRENT_TRIP.targetTemp.max || newTemp < CURRENT_TRIP.targetTemp.min) {
            setIsAlert(true);
          } else {
            setIsAlert(false);
          }
          return newTemp;
        });
      }, 2000); // Fast simulation: 1 real sec = 1 ETA min approx
    } else {
      // Not in transit, reset or keep stable
      if (etaMins === 0 && currentNodeIndex < DELIVERY_NODES.length - 1) {
        setEtaMins(15 + Math.floor(Math.random() * 10)); // random 15-25 mins to next node
      }
    }

    return () => clearInterval(timer);
  }, [stepStatus, currentNodeIndex, etaMins]);

  const handleSimulateNext = () => {
    if (currentNodeIndex >= DELIVERY_NODES.length - 1 && stepStatus === 'unloading') {
      // Reached the end
      setStepStatus('completed');
      return;
    }

    if (stepStatus === 'waiting') {
      setStepStatus('loading');
    } else if (stepStatus === 'loading') {
      setStepStatus('transit');
    } else if (stepStatus === 'transit') {
      setStepStatus('unloading');
      setEtaMins(0);
    } else if (stepStatus === 'unloading') {
      setStepStatus('waiting');
      setCurrentNodeIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-brand-card p-6 rounded-xl border border-slate-800 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight flex items-center gap-2">
              <span className="text-3xl text-brand-primary">🥖</span> PãoTrack <span className="text-brand-secondary font-light">| Distribuição Lean</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gestão e rastreamento em tempo real do Forno Central às Filiais</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-400">Viagem Atual</div>
            <div className="font-bold font-['JetBrains_Mono'] text-emerald-400">{CURRENT_TRIP.id}</div>
          </div>
        </header>

        {/* Main Pipeline Timeline */}
        <BakeryDashboard 
          nodes={DELIVERY_NODES} 
          currentNodeIndex={currentNodeIndex} 
          stepStatus={stepStatus} 
          onSimulateNext={handleSimulateNext}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fleet Management */}
          <FleetManager 
            vehicles={FLEET_VEHICLES}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
          
          {/* Low-cost Telemetry */}
          <LightTelemetry 
            currentTemp={currentTemp}
            targetTemp={CURRENT_TRIP.targetTemp}
            etaMins={etaMins}
            isAlert={isAlert}
          />
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-8 flex justify-center gap-4">
           <button className="btn bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700">
             📥 Exportar Relatório Diário (PDF)
           </button>
           <button 
              onClick={() => {
                setCurrentNodeIndex(0);
                setStepStatus('waiting');
                setCurrentTemp(21.5);
                setIsAlert(false);
              }}
              className="btn bg-brand-secondary hover:bg-blue-400 text-brand-dark font-semibold py-3 px-6 rounded-lg transition-colors border border-brand-secondary">
             🔄 Reiniciar Ciclo de Entrega
           </button>
        </div>

      </div>
    </div>
  );
}

export default App;
