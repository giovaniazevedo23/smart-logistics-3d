import React from 'react';
import { Truck, CheckCircle, Clock, Package, MoveRight } from 'lucide-react';

export default function BakeryDashboard({ nodes, currentNodeIndex, stepStatus, onSimulateNext }) {
  
  const getStatusColor = (nodeIndex) => {
    if (nodeIndex < currentNodeIndex) return 'bg-emerald-500';
    if (nodeIndex === currentNodeIndex) return 'bg-brand-secondary';
    return 'bg-slate-700';
  };

  const getStatusText = (nodeIndex) => {
    if (nodeIndex < currentNodeIndex) return 'Entregue';
    if (nodeIndex === currentNodeIndex) {
      switch(stepStatus) {
        case 'waiting': return 'Aguardando';
        case 'loading': return 'Carregando...';
        case 'transit': return 'Em Trânsito 🚚';
        case 'unloading': return 'Descarregando...';
        default: return 'Ativo';
      }
    }
    return 'Pendente';
  };

  return (
    <div className="bg-brand-card rounded-xl p-6 border border-slate-800 shadow-xl mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Truck className="text-brand-primary" /> Timeline de Distribuição Contínua
        </h2>
        <button 
          onClick={onSimulateNext}
          className="bg-brand-primary hover:bg-amber-600 text-brand-dark font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          Avançar Simulação <MoveRight size={18} />
        </button>
      </div>

      <div className="relative pt-8 pb-4">
        {/* Background Line */}
        <div className="absolute top-12 left-6 right-6 h-1 bg-slate-800 rounded-full" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-12 left-6 h-1 bg-brand-secondary rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `calc(${(currentNodeIndex / (nodes.length - 1)) * 100}% - 48px)` }}
        />

        <div className="relative flex justify-between">
          {nodes.map((node, index) => {
            const isPast = index < currentNodeIndex;
            const isCurrent = index === currentNodeIndex;
            const isFuture = index > currentNodeIndex;

            return (
              <div key={node.id} className="flex flex-col items-center relative z-10 w-32">
                {/* Node Dot / Icon */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-brand-card transition-colors duration-500 shadow-lg
                    ${isPast ? 'bg-emerald-500 text-white' : ''}
                    ${isCurrent ? 'bg-brand-secondary text-brand-dark animate-pulse' : ''}
                    ${isFuture ? 'bg-slate-700 text-slate-400' : ''}
                  `}
                >
                  {isPast ? <CheckCircle size={18} /> : (isCurrent && stepStatus === 'transit' ? <Truck size={18} /> : <Package size={18} />)}
                </div>
                
                {/* Node Info */}
                <div className="mt-3 text-center">
                  <div className="font-semibold text-sm mb-1">{node.name}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block
                    ${isPast ? 'bg-emerald-500/20 text-emerald-400' : ''}
                    ${isCurrent ? 'bg-brand-secondary/20 text-brand-secondary font-bold' : ''}
                    ${isFuture ? 'bg-slate-800 text-slate-500' : ''}
                  `}>
                    {getStatusText(index)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
