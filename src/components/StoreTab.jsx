import React, { useState } from 'react';
import { ShoppingCart, PackagePlus, Calculator, Save, CheckCircle2, Lock } from 'lucide-react';

const PRODUCTS = [
  { id: 'pao_frances', name: 'Pão Francês Congelado', qty: 1694, type: 'Sensível (-18°C)' },
  { id: 'pao_queijo', name: 'Pão de Queijo Cru', qty: 500, type: 'Moderado (-12°C)' },
];

const EQUIPMENTS = [
  { id: 'caixa_epp', name: 'Caixa Isotérmica EPP (60L)', price: 185.00, desc: 'Alta retenção térmica para transporte.' },
  { id: 'gelox', name: 'Placa Eutética (Gelox) -20°C', price: 35.50, desc: 'Frio passivo de alta duração.' },
  { id: 'sensor_ble', name: 'Sensor de Temperatura BLE IoT', price: 120.00, desc: 'Telemetria em tempo real pelo celular.' }
];

const BASE_FREIGHT = 150.00; // Base cost for Fiorino run

export default function StoreTab({ storeResult, setStoreResult, setActiveTab, isLocked }) {
  const [cart, setCart] = useState(storeResult?.cart || {});
  
  const handleAddToCart = (eqId, change) => {
    if (isLocked) return;
    setCart(prev => {
      const current = prev[eqId] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [eqId]: next };
    });
  };

  const calculateTotal = () => {
    let equipTotal = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const eq = EQUIPMENTS.find(e => e.id === id);
      if (eq) equipTotal += eq.price * qty;
    });
    return { equipTotal, finalTotal: BASE_FREIGHT + equipTotal };
  };

  const { equipTotal, finalTotal } = calculateTotal();

  const handleSave = () => {
    setStoreResult({
      cart,
      totals: { equipTotal, finalTotal, baseFreight: BASE_FREIGHT }
    });
    // Move para a proxima aba automaticamente
    setActiveTab('questionnaire');
  };

  return (
    <div className="bg-brand-card rounded-xl p-8 border border-slate-800 shadow-xl max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-brand-primary" size={32} />
          <div>
            <h2 className="text-2xl font-bold">Loja de Insumos & Orçamento</h2>
            <p className="text-slate-400">Dimensione seu transporte e contrate os equipamentos térmicos necessários.</p>
          </div>
        </div>
        {isLocked && (
          <div className="bg-rose-900/30 text-rose-400 border border-rose-500/50 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
            <Lock size={16} /> PLANO BLOQUEADO (EM ROTA)
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Produtos e Equipamentos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary flex items-center gap-2">
              <PackagePlus size={20} /> 1. Produtos a Transportar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTS.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-600 p-4 rounded-lg flex justify-between items-center opacity-70">
                  <div>
                    <strong className="text-slate-200 block">{p.name}</strong>
                    <span className="text-xs text-slate-400">{p.type}</span>
                  </div>
                  <div className="font-bold text-brand-secondary">{p.qty} un</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary flex items-center gap-2">
              <ShoppingCart size={20} /> 2. Contratação de Equipamentos
            </h3>
            <p className="text-sm text-slate-400 mb-6">Se você já possui as caixas térmicas e placas eutéticas, não precisa adicionar nada. Caso contrário, adicione ao pacote da viagem:</p>
            
            <div className="space-y-4">
              {EQUIPMENTS.map(eq => {
                const qty = cart[eq.id] || 0;
                return (
                  <div key={eq.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <strong className="text-slate-200 block">{eq.name}</strong>
                      <p className="text-xs text-slate-400">{eq.desc}</p>
                      <span className="text-emerald-400 font-bold mt-1 block">R$ {eq.price.toFixed(2)} / un</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-600">
                      <button 
                        type="button"
                        onClick={() => handleAddToCart(eq.id, -1)}
                        disabled={isLocked || qty === 0}
                        className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-md disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-white">{qty}</span>
                      <button 
                        type="button"
                        onClick={() => handleAddToCart(eq.id, 1)}
                        disabled={isLocked}
                        className="w-8 h-8 flex items-center justify-center bg-brand-secondary hover:bg-blue-400 text-brand-dark font-bold rounded-md disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Direito: Relatório Financeiro */}
        <div>
          <div className="bg-slate-900 border border-brand-primary/50 p-6 rounded-xl sticky top-6 shadow-2xl">
            <h3 className="font-bold text-xl mb-6 text-brand-primary flex items-center gap-2 border-b border-slate-700 pb-4">
              <Calculator size={24} /> Relatório Financeiro
            </h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Custo Base Frete (Utilitário):</span>
                <span className="font-semibold">R$ {BASE_FREIGHT.toFixed(2)}</span>
              </div>
              
              {Object.entries(cart).map(([id, qty]) => {
                if (qty === 0) return null;
                const eq = EQUIPMENTS.find(e => e.id === id);
                return (
                  <div key={id} className="flex justify-between items-center text-slate-400">
                    <span className="truncate pr-4">{qty}x {eq.name}</span>
                    <span>R$ {(eq.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}

              <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                <span className="text-slate-200 font-bold text-lg">Custo Total:</span>
                <span className="text-emerald-400 font-bold text-2xl">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isLocked}
              className={`w-full font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${
                isLocked 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-brand-primary hover:bg-amber-500 text-brand-dark'
              }`}
            >
              {isLocked ? (
                <>Bloqueado (Viagem em Andamento)</>
              ) : (
                <><Save size={20} /> Salvar Plano e Avançar</>
              )}
            </button>
            
            {!isLocked && (
              <p className="text-xs text-center text-slate-500 mt-4">
                Você ainda poderá alterar os itens antes de iniciar a simulação da rota.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
