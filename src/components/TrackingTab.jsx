import React, { useState, useEffect } from 'react';
import { Package, BellRing } from 'lucide-react';
import BakeryDashboard from './BakeryDashboard';
import FleetManager from './FleetManager';
import LightTelemetry from './LightTelemetry';
import LiveMapRoute from './LiveMapRoute';
import AiContextPanel from './AiContextPanel';
import MethodologyManual from './MethodologyManual';
import { DELIVERY_NODES, FLEET_VEHICLES, CURRENT_TRIP } from '../data/bakeryData';

export default function TrackingTab({ onLock, onReset }) {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [stepStatus, setStepStatus] = useState('waiting');
  const [selectedVehicleId, setSelectedVehicleId] = useState(FLEET_VEHICLES[0].id);
  const [currentTemp, setCurrentTemp] = useState(-15.5);
  const [etaMins, setEtaMins] = useState(0);
  const [isAlert, setIsAlert] = useState(false);
  const [showGeofence, setShowGeofence] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });
  const [showManual, setShowManual] = useState(false);

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  useEffect(() => {
    let timer;
    if (stepStatus === 'transit') {
      timer = setInterval(() => {
        setEtaMins(prev => {
          const nextEta = Math.max(0, prev - 1);
          if (nextEta > 0 && nextEta <= 5 && !showGeofence) {
            setShowGeofence(true);
          }
          if (nextEta === 0) setShowGeofence(false);
          return nextEta;
        });
        
        setCurrentTemp(prev => {
          const change = (Math.random() - 0.2) * 0.8; 
          const newTemp = prev + change;
          setIsAlert(newTemp > -10);
          return newTemp;
        });
      }, 2000); 
    } else {
      if (etaMins === 0 && currentNodeIndex < DELIVERY_NODES.length - 1) {
        setEtaMins(15 + Math.floor(Math.random() * 10)); 
      }
    }
    return () => clearInterval(timer);
  }, [stepStatus, currentNodeIndex, etaMins, showGeofence]);

  const handleSimulateNext = () => {
    if (currentNodeIndex >= DELIVERY_NODES.length - 1 && stepStatus === 'unloading') {
      setStepStatus('completed');
      return;
    }

    if (stepStatus === 'waiting') {
      setStepStatus('loading');
      if (onLock) onLock();
      showToast('Logística Iniciada', `Carregamento iniciado na ${DELIVERY_NODES[currentNodeIndex].name}.`);
    } else if (stepStatus === 'loading') {
      setStepStatus('transit');
      setShowGeofence(false);
      showToast('Produto em Trânsito', `Veículo a caminho da próxima parada. Acompanhe pelo mapa.`);
    } else if (stepStatus === 'transit') {
      setStepStatus('unloading');
      setEtaMins(0);
      setShowGeofence(false);
      showToast('Chegada ao Destino', `Veículo chegou na filial destino. Inicie o descarregamento rápido.`);
    } else if (stepStatus === 'unloading') {
      setStepStatus('waiting');
      setCurrentNodeIndex(prev => prev + 1);
      showToast('Transferência Concluída', `Estoque atualizado e entrega confirmada com sucesso!`);
    }
  };

  return (
    <div className="animate-fade-in">
      {showGeofence && stepStatus === 'transit' && (
        <div className="mb-6 bg-blue-900/40 border border-blue-500 p-4 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-full">
              <BellRing size={24} />
            </div>
            <div>
              <h3 className="font-bold text-blue-300 text-lg">Alerta de Geofencing (Pré-Chegada)</h3>
              <p className="text-blue-100 text-sm">
                Veículo a menos de 500m (ETA: {etaMins}m) da <strong>{DELIVERY_NODES[currentNodeIndex + 1]?.name}</strong>. 
                Por favor, prepare a câmara de recepção para evitar quebra da cadeia de frio!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Pop-up Lateral) */}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-[999] bg-slate-800 border-l-4 border-brand-secondary p-4 rounded shadow-2xl animate-fade-in flex flex-col gap-1 max-w-sm">
          <div className="flex items-center gap-2 text-brand-secondary font-bold">
            <BellRing size={16} /> {toast.title}
          </div>
          <p className="text-sm text-slate-300">{toast.message}</p>
        </div>
      )}

      {/* IA Context Panel */}
      <div className="mb-6">
        <AiContextPanel currentNodeIndex={currentNodeIndex} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Status da Operação</h2>
        <button 
          onClick={() => setShowManual(true)}
          className="bg-brand-secondary/20 hover:bg-brand-secondary/40 text-brand-secondary border border-brand-secondary/50 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          📘 Ver Manual de Carregamento (C.A.S.A)
        </button>
      </div>

      <LiveMapRoute 
        currentNodeIndex={currentNodeIndex}
        stepStatus={stepStatus}
      />

      <BakeryDashboard 
        nodes={DELIVERY_NODES} 
        currentNodeIndex={currentNodeIndex} 
        stepStatus={stepStatus} 
        onSimulateNext={handleSimulateNext}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FleetManager 
          vehicles={FLEET_VEHICLES}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
        <LightTelemetry 
          currentTemp={currentTemp}
          targetTemp={CURRENT_TRIP.targetTemp}
          etaMins={etaMins}
          isAlert={isAlert}
        />
      </div>

      {stepStatus === 'unloading' && currentNodeIndex > 0 && (
        <div className="mt-6 bg-slate-800/80 p-6 rounded-xl border border-brand-secondary/50 flex flex-col md:flex-row items-center gap-6 animate-pulse">
          <div className="bg-white p-3 rounded-lg flex-shrink-0">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Confirma%C3%A7%C3%A3o+SAGA+SENAI" alt="QR Code" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Package className="text-brand-secondary" /> Módulo de Recebimento Digital
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              O motorista chegou na <strong>{DELIVERY_NODES[currentNodeIndex].name}</strong>. Utilize o leitor de QR Code para validar as {DELIVERY_NODES[currentNodeIndex].quantity} unidades e evitar divergências de estoque!
            </p>
            <button 
              onClick={handleSimulateNext}
              className="bg-brand-secondary hover:bg-blue-400 text-brand-dark font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Conferência Concluída (Finalizar Descarga)
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
         <button 
            onClick={() => {
              setCurrentNodeIndex(0);
              setStepStatus('waiting');
              setCurrentTemp(-15.5);
              setIsAlert(false);
              setShowGeofence(false);
              if (onReset) onReset();
            }}
            className="btn bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700">
           🔄 Reiniciar Ciclo de Entrega
         </button>
      </div>

      {showManual && (
        <MethodologyManual onClose={() => setShowManual(false)} />
      )}
    </div>
  );
}
