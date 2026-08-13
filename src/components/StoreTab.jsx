import React, { useState, useEffect } from 'react';
import { ShoppingCart, PackagePlus, Calculator, Save, CheckCircle2, Lock, ShieldCheck, MapPin, Truck } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

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
  
  // New Freight Logic
  const [routeDistance, setRouteDistance] = useState(storeResult?.routeDistance || 50);
  const [stopsCount, setStopsCount] = useState(storeResult?.stopsCount || 4);
  const [stopAllocations, setStopAllocations] = useState(storeResult?.stopAllocations || [500, 500, 500, 694]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [savedData, setSavedData] = useState(null);
  
  const totalBreads = PRODUCTS.reduce((sum, p) => sum + p.qty, 0);
  const productTotalValue = PRODUCTS.reduce((sum, p) => sum + (p.qty * p.unitValue), 0);
  const insuranceFee = productTotalValue * 0.015; // 1.5%

  const handleAddFleet = (vId, change) => {
    if (isLocked) return;
    setFleetCart(prev => {
      const current = prev[vId] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [vId]: next };
    });
  };

  const handleAllocationChange = (index, value) => {
    const val = parseInt(value) || 0;
    const newAllocations = [...stopAllocations];
    newAllocations[index] = val;
    setStopAllocations(newAllocations);
  };

  useEffect(() => {
    // Adjust allocations array size when stops count changes
    if (stopsCount > stopAllocations.length) {
      setStopAllocations([...stopAllocations, ...Array(stopsCount - stopAllocations.length).fill(0)]);
    } else if (stopsCount < stopAllocations.length) {
      setStopAllocations(stopAllocations.slice(0, stopsCount));
    }
  }, [stopsCount]);

  const allocatedTotal = stopAllocations.reduce((a,b)=>a+b, 0);
  
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

    const stopsCost = stopsCount > 1 ? (stopsCount - 1) * 100 : 0;
    const extraKmCost = routeDistance > 50 ? (routeDistance - 50) * 2.50 : 0;

    const finalTotal = fleetTotal + equipTotal + stopsCost + extraKmCost + (hasInsurance ? insuranceFee : 0);
    return { equipTotal, fleetTotal, fleetCapacity, stopsCost, extraKmCost, finalTotal };
  };

  const { equipTotal, fleetTotal, fleetCapacity, stopsCost, extraKmCost, finalTotal } = calculateTotal();
  const capacityPct = Math.min(100, (fleetCapacity / totalBreads) * 100);
  const isCapacityMet = fleetCapacity >= totalBreads;

  const handleSave = () => {
    if (!isCapacityMet) {
      alert("Atenção: A capacidade da frota escolhida é menor que a quantidade total de pães (2.194 un). Adicione mais veículos.");
      return;
    }
    if (allocatedTotal !== totalBreads) {
      alert(`Atenção: A distribuição de carga não bate. Faltam/Sobram pães. Total: ${totalBreads}, Alocado: ${allocatedTotal}`);
      return;
    }

    const payload = {
      cart,
      fleetCart,
      hasInsurance,
      routeDistance,
      stopsCount,
      stopAllocations,
      totals: { equipTotal, finalTotal, baseFreight: fleetTotal, stopsCost, extraKmCost, insuranceFee: hasInsurance ? insuranceFee : 0 }
    };
    
    setSavedData(payload);
    setShowInvoice(true);
  };

  const handleAcceptInvoice = () => {
    setStoreResult(savedData);
    setShowInvoice(false);
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

            {/* Configuração de Rota e Paradas */}
            <div className="mt-6 border-t border-slate-700 pt-6">
              <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><MapPin className="text-brand-primary"/> 2. Roteirização e Paradas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900 border border-slate-600 p-4 rounded-lg">
                  <label className="text-sm text-slate-400 block mb-1">Distância Total Estimada (km)</label>
                  <input 
                    type="number" 
                    value={routeDistance}
                    onChange={(e) => setRouteDistance(Number(e.target.value))}
                    disabled={isLocked}
                    min="1"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 focus:border-brand-primary outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">Até 50km isento. +R$2,50/km extra.</p>
                </div>
                <div className="bg-slate-900 border border-slate-600 p-4 rounded-lg">
                  <label className="text-sm text-slate-400 block mb-1">Total de Paradas (Filiais)</label>
                  <input 
                    type="number" 
                    value={stopsCount}
                    onChange={(e) => setStopsCount(Number(e.target.value))}
                    disabled={isLocked}
                    min="1"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 focus:border-brand-primary outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">1ª parada isenta. +R$100,00 por parada adicional.</p>
                </div>
              </div>

              {/* Distribuição da carga */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-2">
                <div className="flex justify-between items-center mb-3 text-sm">
                  <strong className="text-slate-300">Distribuição de Carga</strong>
                  <span className={allocatedTotal === totalBreads ? "text-emerald-400" : "text-amber-400"}>
                    Alocado: {allocatedTotal} / {totalBreads}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stopAllocations.map((alloc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-16">Parada {idx + 1}:</span>
                      <input 
                        type="number"
                        value={alloc}
                        onChange={(e) => handleAllocationChange(idx, e.target.value)}
                        disabled={isLocked}
                        min="0"
                        className="flex-1 bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-sm focus:border-brand-primary outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Veiculos de Frota */}
            <div className="mt-6 border-t border-slate-700 pt-6">
              <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><Truck className="text-brand-primary"/> 3. Dimensionamento de Frota</h4>
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
                <p className="text-sm text-slate-400 mt-1">Garantia total contra quebra de cadeia do frio e sinistros. Taxa de 1.5% sobre o valor dos produtos transportados (Valor Declarado: R$ {productTotalValue.toFixed(2)}).</p>
                <span className="text-blue-400 font-bold text-sm block mt-2">+ R$ {insuranceFee.toFixed(2)} ao total</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary flex items-center gap-2">
              <ShoppingCart size={20} /> 4. Contratação de Equipamentos
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

              {stopsCost > 0 && (
                <div className="flex justify-between items-center text-rose-300">
                  <span>Taxa Paradas Extras ({stopsCount - 1}):</span>
                  <span>R$ {stopsCost.toFixed(2)}</span>
                </div>
              )}
              {extraKmCost > 0 && (
                <div className="flex justify-between items-center text-rose-300">
                  <span>Adicional KM (>50km):</span>
                  <span>R$ {extraKmCost.toFixed(2)}</span>
                </div>
              )}
              
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
                  <span className="truncate pr-4 flex items-center gap-1"><ShieldCheck size={14}/> Seguro de Carga (1.5%)</span>
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

      {showInvoice && savedData && (
        <InvoiceModal 
          savedData={savedData} 
          onAccept={handleAcceptInvoice} 
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
