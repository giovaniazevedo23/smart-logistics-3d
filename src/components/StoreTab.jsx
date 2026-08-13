import React, { useState } from 'react';
import { ShoppingCart, PackagePlus, Calculator, Save, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

const PRODUCTS = [
  { id: 'pao_frances', name: 'Pão Francês Congelado', qty: 1694, type: 'Sensível (-18°C)', unitValue: 0.50 },
  { id: 'pao_queijo', name: 'Pão de Queijo Cru', qty: 500, type: 'Moderado (-12°C)', unitValue: 1.50 },
];

const EQUIPMENTS = [
  { id: 'caixa_epp', name: 'Caixa Isotérmica EPP (60L)', price: 185.00, desc: 'Alta retenção térmica para transporte.' },
  { id: 'gelox', name: 'Placa Eutética (Gelox) -20°C', price: 35.50, desc: 'Frio passivo de alta duração.' },
  { id: 'sensor_ble', name: 'Sensor de Temperatura BLE IoT', price: 120.00, desc: 'Telemetria em tempo real pelo celular.' }
];

const FLEET = [
  { id: 'fiorino', name: 'Fiorino Refrigerada', capacity: 1000, price: 150.00 },
  { id: 'vuc', name: 'VUC Urbano', capacity: 2500, price: 250.00 },
  { id: 'hr', name: 'Caminhão HR', capacity: 4000, price: 350.00 }
];

export default function StoreTab({ storeResult, setStoreResult, setActiveTab, isLocked }) {
  const [cart, setCart] = useState(storeResult?.cart || {});
  const [fleetCart, setFleetCart] = useState(storeResult?.fleetCart || { fiorino: 1 });
  const [hasInsurance, setHasInsurance] = useState(storeResult?.hasInsurance || false);
  
  const totalBreads = PRODUCTS.reduce((sum, p) => sum + p.qty, 0);
  const productTotalValue = PRODUCTS.reduce((sum, p) => sum + (p.qty * p.unitValue), 0);
  const insuranceFee = productTotalValue * 0.20;

  const handleAddFleet = (vId, change) => {
    if (isLocked) return;
    setFleetCart(prev => {
      const current = prev[vId] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [vId]: next };
    });
  };
  
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

    let fleetTotal = 0;
    let fleetCapacity = 0;
    Object.entries(fleetCart).forEach(([id, qty]) => {
      const v = FLEET.find(v => v.id === id);
      if (v) {
        fleetTotal += v.price * qty;
        fleetCapacity += v.capacity * qty;
      }
    });

    const finalTotal = fleetTotal + equipTotal + (hasInsurance ? insuranceFee : 0);
    return { equipTotal, fleetTotal, fleetCapacity, finalTotal };
  };

  const { equipTotal, fleetTotal, fleetCapacity, finalTotal } = calculateTotal();
  const capacityPct = Math.min(100, (fleetCapacity / totalBreads) * 100);
  const isCapacityMet = fleetCapacity >= totalBreads;

  const handleSave = () => {
    if (!isCapacityMet) {
      alert("Atenção: A capacidade da frota escolhida é menor que a quantidade total de pães (2.194 un). Adicione mais veículos.");
      return;
    }
    setStoreResult({
      cart,
      fleetCart,
      hasInsurance,
      totals: { equipTotal, finalTotal, baseFreight: fleetTotal, insuranceFee: hasInsurance ? insuranceFee : 0 }
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

            {/* Veiculos de Frota */}
            <div className="mt-6 border-t border-slate-700 pt-6">
              <h4 className="font-bold text-slate-200 mb-4">Dimensionamento de Frota (Múltiplos Veículos)</h4>
              <p className="text-sm text-slate-400 mb-4">Escolha a frota necessária para suprir a demanda de <strong>{totalBreads} pães</strong>.</p>
              
              <div className="space-y-3 mb-6">
                {FLEET.map(v => {
                  const qty = fleetCart[v.id] || 0;
                  return (
                    <div key={v.id} className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <strong className="text-slate-200 block">{v.name}</strong>
                        <span className="text-xs text-brand-secondary">Capacidade: {v.capacity} pães</span>
                        <span className="text-emerald-400 font-bold ml-4">R$ {v.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-600">
                        <button 
                          type="button"
                          onClick={() => handleAddFleet(v.id, -1)}
                          disabled={isLocked || qty === 0}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-md disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-white">{qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleAddFleet(v.id, 1)}
                          disabled={isLocked}
                          className="w-8 h-8 flex items-center justify-center bg-brand-primary hover:bg-amber-400 text-brand-dark font-bold rounded-md disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Capacity Bar */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Capacidade da Frota: <strong className={isCapacityMet ? 'text-emerald-400' : 'text-rose-400'}>{fleetCapacity} / {totalBreads} un</strong></span>
                  {isCapacityMet ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold"><CheckCircle2 size={16}/> Suficiente</span>
                  ) : (
                    <span className="text-rose-400 font-bold">Capacidade Insuficiente</span>
                  )}
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${isCapacityMet ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${capacityPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Seguro Adicional */}
            <div className="mt-4 p-4 border border-blue-500/50 bg-blue-900/20 rounded-lg flex items-start gap-4">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  id="insurance" 
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  disabled={isLocked}
                  className="w-5 h-5 rounded bg-slate-900 border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="insurance" className="font-bold text-blue-300 flex items-center gap-2 cursor-pointer">
                  <ShieldCheck size={18} /> Plano de Seguro (Integridade 100%)
                </label>
                <p className="text-sm text-slate-400 mt-1">Garantia total contra quebra de cadeia do frio e sinistros. Taxa de 20% sobre o valor dos produtos transportados (Valor Declarado: R$ {productTotalValue.toFixed(2)}).</p>
                <span className="text-blue-400 font-bold text-sm block mt-2">+ R$ {insuranceFee.toFixed(2)} ao total</span>
              </div>
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
                <span className="font-bold">Custo de Frota:</span>
                <span className="font-semibold">R$ {fleetTotal.toFixed(2)}</span>
              </div>
              {Object.entries(fleetCart).map(([id, qty]) => {
                if (qty === 0) return null;
                const v = FLEET.find(x => x.id === id);
                return (
                  <div key={id} className="flex justify-between items-center text-slate-500 pl-2">
                    <span className="truncate pr-4">{qty}x {v.name}</span>
                    <span>R$ {(v.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="border-b border-slate-700 pb-2"></div>
              
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

              {hasInsurance && (
                <div className="flex justify-between items-center text-blue-400">
                  <span className="truncate pr-4 flex items-center gap-1"><ShieldCheck size={14}/> Seguro de Carga (20%)</span>
                  <span>R$ {insuranceFee.toFixed(2)}</span>
                </div>
              )}

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
