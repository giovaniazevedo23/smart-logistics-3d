import React, { useState, useEffect } from 'react';
import { ShoppingCart, PackagePlus, Calculator, Save, CheckCircle2, Lock, ShieldCheck, MapPin, Truck, Plus, Trash2 } from 'lucide-react';
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
  { id: 'fiorino', name: 'Fiorino Refrigerada', capacity: 1000, price: 150.00, company: 'Superfrios' },
  { id: 'vuc', name: 'VUC Urbano', capacity: 2500, price: 250.00, company: 'Dito Transportes' },
  { id: 'hr', name: 'Caminhão HR', capacity: 4000, price: 350.00, company: 'Kanejo' }
];

export default function StoreTab({ storeResult, setStoreResult, setActiveTab, isLocked }) {
  const [products, setProducts] = useState(() => {
    return storeResult?.products || PRODUCTS;
  });
  const [isAutonomous, setIsAutonomous] = useState(storeResult?.isAutonomous || false);
  const [selectedPlan, setSelectedPlan] = useState(storeResult?.selectedPlan || 'none');
  const [cart, setCart] = useState(storeResult?.cart || {});
  const [fleetCart, setFleetCart] = useState(storeResult?.fleetCart || { fiorino: 1 });
  const [hasInsurance, setHasInsurance] = useState(storeResult?.hasInsurance || false);

  useEffect(() => {
    if (selectedPlan !== 'none') {
      setHasInsurance(true);
    }
  }, [selectedPlan]);
  
  // New Freight Logic
  const [routeDistance, setRouteDistance] = useState(storeResult?.routeDistance || 50);
  const [stopsCount, setStopsCount] = useState(storeResult?.stopsCount || 4);
  const [stopAllocations, setStopAllocations] = useState(storeResult?.stopAllocations || [500, 500, 500, 694]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [savedData, setSavedData] = useState(null);

  // Form state for adding custom product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdQty, setNewProdQty] = useState(100);
  const [newProdType, setNewProdType] = useState('Sensível (-18°C)');
  const [newProdUnitValue, setNewProdUnitValue] = useState(0.50);
  
  const totalBreads = products.reduce((sum, p) => sum + p.qty, 0);
  const productTotalValue = products.reduce((sum, p) => sum + (p.qty * p.unitValue), 0);
  const insuranceFee = productTotalValue * 0.015; // 1.5%

  const handleAddFleet = (vId, change) => {
    if (isLocked || isAutonomous) return;
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

  const handleProductQtyChange = (pId, value) => {
    if (isLocked) return;
    const val = Math.max(0, parseInt(value) || 0);
    setProducts(prev => prev.map(p => p.id === pId ? { ...p, qty: val } : p));
  };

  const handleRemoveProduct = (pId) => {
    if (isLocked) return;
    setProducts(prev => prev.filter(p => p.id !== pId));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProduct = {
      id: `custom_${Date.now()}`,
      name: newProdName.trim(),
      qty: Math.max(1, parseInt(newProdQty) || 0),
      type: newProdType,
      unitValue: Math.max(0, parseFloat(newProdUnitValue) || 0)
    };

    setProducts(prev => [...prev, newProduct]);
    
    // Reset form
    setNewProdName('');
    setNewProdQty(100);
    setNewProdType('Sensível (-18°C)');
    setNewProdUnitValue(0.50);
    setShowAddForm(false);
  };

  const handleAutoAllocate = () => {
    if (isLocked || stopsCount <= 0) return;
    const baseShare = Math.floor(totalBreads / stopsCount);
    const remainder = totalBreads % stopsCount;
    const newAllocations = Array(stopsCount).fill(baseShare);
    if (stopsCount > 0) {
      newAllocations[stopsCount - 1] += remainder;
    }
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
    
    if (isAutonomous) {
      fleetTotal = 0;
      fleetCapacity = totalBreads;
    } else {
      Object.entries(fleetCart).forEach(([id, qty]) => {
        const v = FLEET.find(v => v.id === id);
        if (v) {
          fleetTotal += v.price * qty;
          fleetCapacity += v.capacity * qty;
        }
      });
    }

    const originalStopsCost = stopsCount > 1 ? (stopsCount - 1) * 100 : 0;
    const extraKmCost = routeDistance > 50 ? (routeDistance - 50) * 2.50 : 0;

    // Calculate freight discount
    let discountPercent = 0;
    let stopsDiscountPercent = 0;
    if (selectedPlan === 'basic') {
      discountPercent = 0.10;
    } else if (selectedPlan === 'premium') {
      discountPercent = 0.20;
      stopsDiscountPercent = 0.15;
    } else if (selectedPlan === 'gold') {
      discountPercent = 0.30;
      stopsDiscountPercent = 0.25;
    }

    const baseFreightOriginal = fleetTotal + extraKmCost;
    const freightDiscount = baseFreightOriginal * discountPercent;
    const baseFreightDiscounted = baseFreightOriginal - freightDiscount;

    const stopsDiscount = originalStopsCost * stopsDiscountPercent;
    const stopsCost = originalStopsCost - stopsDiscount;

    // Insurance: free if any plan is selected
    const effectiveInsuranceFee = selectedPlan !== 'none' ? 0 : insuranceFee;
    const finalInsuranceFee = hasInsurance ? effectiveInsuranceFee : 0;

    const finalTotal = baseFreightDiscounted + stopsCost + equipTotal + finalInsuranceFee;

    return { 
      equipTotal, 
      fleetTotal, 
      fleetCapacity, 
      stopsCost, 
      stopsDiscount,
      extraKmCost, 
      freightDiscount, 
      finalTotal, 
      insuranceFee: finalInsuranceFee 
    };
  };

  const { equipTotal, fleetTotal, fleetCapacity, stopsCost, stopsDiscount = 0, extraKmCost, freightDiscount, finalTotal, insuranceFee: finalInsuranceFee } = calculateTotal();
  const capacityPct = totalBreads > 0 ? Math.min(100, (fleetCapacity / totalBreads) * 100) : 100;
  const isCapacityMet = fleetCapacity >= totalBreads;

  const handleSave = () => {
    if (!isCapacityMet) {
      alert(`Atenção: A capacidade da frota escolhida (${fleetCapacity} un) é menor que a quantidade total de produtos (${totalBreads} un). Adicione mais veículos ou use o Transporte Autônomo.`);
      return;
    }
    if (allocatedTotal !== totalBreads) {
      alert(`Atenção: A distribuição de carga não bate. Faltam/Sobram unidades. Total a transportar: ${totalBreads}, Alocado nas paradas: ${allocatedTotal}`);
      return;
    }

    const payload = {
      cart,
      fleetCart,
      hasInsurance,
      routeDistance,
      stopsCount,
      stopAllocations,
      products,
      isAutonomous,
      selectedPlan,
      totals: { 
        equipTotal, 
        finalTotal, 
        baseFreight: fleetTotal, 
        stopsCost, 
        stopsDiscount,
        extraKmCost, 
        freightDiscount, 
        insuranceFee: finalInsuranceFee 
      }
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-brand-secondary flex items-center gap-2">
                <PackagePlus size={20} /> 1. Produtos a Transportar
              </h3>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-brand-secondary/20 hover:bg-brand-secondary/40 text-brand-secondary text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-secondary/30 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Cadastrar Produto
                </button>
              )}
            </div>

            {/* Form to add custom product */}
            {showAddForm && (
              <form onSubmit={handleAddProduct} className="bg-slate-900 border border-brand-secondary/40 p-4 rounded-lg mb-4 space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      placeholder="Ex: Pão de Forma Congelado"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-sm focus:border-brand-secondary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Tipo de Temperatura</label>
                    <select
                      value={newProdType}
                      onChange={(e) => setNewProdType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-sm focus:border-brand-secondary outline-none"
                    >
                      <option value="Sensível (-18°C)">Sensível (-18°C)</option>
                      <option value="Moderado (-12°C)">Moderado (-12°C)</option>
                      <option value="Refrigerado (4°C)">Refrigerado (4°C)</option>
                      <option value="Seco / Temperatura Ambiente">Seco / Temp. Ambiente</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Quantidade</label>
                    <input
                      type="number"
                      value={newProdQty}
                      onChange={(e) => setNewProdQty(parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-sm focus:border-brand-secondary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Valor Unitário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProdUnitValue}
                      onChange={(e) => setNewProdUnitValue(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-sm focus:border-brand-secondary outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-secondary hover:bg-blue-400 text-brand-dark font-bold px-4 py-1.5 rounded text-xs transition-colors"
                  >
                    Adicionar Produto
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center relative group">
                  <div className="flex-1 pr-2">
                    <strong className="text-slate-200 block text-sm truncate">{p.name}</strong>
                    <span className="text-[10px] text-slate-400">{p.type}</span>
                    <span className="text-[10px] text-emerald-400 block">R$ {p.unitValue.toFixed(2)} / un</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <label className="text-[9px] text-slate-500 mb-0.5 text-right">Qtd.</label>
                      <input
                        type="number"
                        value={p.qty}
                        onChange={(e) => handleProductQtyChange(p.id, e.target.value)}
                        disabled={isLocked}
                        min="0"
                        className="w-20 bg-slate-800 border border-slate-700 text-white rounded px-1 py-1 text-center font-bold text-sm text-brand-secondary outline-none focus:border-brand-primary disabled:opacity-70"
                      />
                    </div>

                    {!isLocked && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="text-rose-500 hover:text-rose-400 p-1 mt-3 transition-colors"
                        title="Remover produto"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
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
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-300">Distribuição de Carga</strong>
                    {!isLocked && (
                      <button
                        type="button"
                        onClick={handleAutoAllocate}
                        className="text-[11px] bg-slate-700 hover:bg-slate-600 text-brand-primary px-2.5 py-0.5 rounded border border-slate-600 transition-colors font-semibold"
                        title="Distribui o total de produtos igualmente entre as filiais"
                      >
                        Auto-distribuir
                      </button>
                    )}
                  </div>
                  <span className={allocatedTotal === totalBreads ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
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
              <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2"><Truck className="text-brand-primary"/> 3. Dimensionamento de Frota</h4>
              
              <div className="bg-blue-950/40 text-blue-300 border border-blue-800/60 p-3 rounded-lg text-xs leading-relaxed mb-4">
                ℹ️ **Frota Homologada Parceira:** Os veículos da frota abaixo são operados por nossas transportadoras credenciadas (**Superfrios**, **Dito Transportes** e **Kanejo**). O SIT indexa e integra esses serviços em tempo real para consolidar e otimizar a sua logística.
              </div>

              {/* Toggle de Transporte Próprio (Autônomo) */}
              <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-lg flex items-start gap-4 mb-4">
                <div className="mt-1">
                  <input 
                    type="checkbox" 
                    id="isAutonomous" 
                    checked={isAutonomous}
                    onChange={(e) => {
                      setIsAutonomous(e.target.checked);
                      if (e.target.checked) {
                        setFleetCart({});
                      } else {
                        setFleetCart({ fiorino: 1 });
                      }
                    }}
                    disabled={isLocked}
                    className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-brand-primary focus:ring-brand-primary cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="isAutonomous" className="font-bold text-amber-300 flex items-center gap-2 cursor-pointer text-sm">
                    🚚 Utilizar Transporte Próprio (Autônomo)
                  </label>
                  <p className="text-xs text-slate-400 mt-1">
                    Marque para transportar usando seus próprios veículos. O custo de frete será **R$ 0,00**, assumindo toda a responsabilidade operacional e de controle de temperatura.
                  </p>
                </div>
              </div>

              {!isAutonomous && (
                <p className="text-sm text-slate-400 mb-4">Escolha a frota necessária para suprir a demanda de <strong>{totalBreads} pães/produtos</strong>.</p>
              )}

              <div className={`space-y-3 mb-6 transition-opacity duration-200 ${isAutonomous ? 'opacity-40 pointer-events-none' : ''}`}>
                {FLEET.map(v => {
                  const qty = fleetCart[v.id] || 0;
                  return (
                    <div key={v.id} className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-200 block">{v.name}</strong>
                          <span className="text-[10px] text-slate-400 border border-slate-700 bg-slate-950 px-1.5 py-0.5 rounded font-mono">{v.company}</span>
                        </div>
                        <span className="text-xs text-brand-secondary">Capacidade: {v.capacity} pães</span>
                        <span className="text-emerald-400 font-bold ml-4">R$ {v.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-600">
                        <button 
                          type="button"
                          onClick={() => handleAddFleet(v.id, -1)}
                          disabled={isLocked || qty === 0 || isAutonomous}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-md disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-white">{qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleAddFleet(v.id, 1)}
                          disabled={isLocked || isAutonomous}
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

          {/* Card: Planos de Assinatura */}
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2 text-brand-secondary flex items-center gap-2">
              💳 Planos de Assinatura Mensal
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Nossos planos foram desenhados para atender desde pequenas padarias em fase de teste até redes de grande volume, garantindo previsibilidade de receita para a nossa startup e economia real de frete para o seu negócio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opção Sem Fidelidade */}
              <div 
                onClick={() => !isLocked && setSelectedPlan('none')}
                className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col justify-between ${
                  selectedPlan === 'none' 
                    ? 'border-slate-400 bg-slate-900 shadow-md' 
                    : 'border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-slate-200">Sem Fidelidade</strong>
                    <span className="text-xs text-slate-400">Normal</span>
                  </div>
                  <p className="text-xs text-slate-400">Seguir com o preço padrão sem contrato mensal ou descontos adicionais.</p>
                </div>
                <div className="text-right mt-4">
                  <span className="font-bold text-sm text-slate-300">R$ 0,00</span>
                </div>
              </div>

              {/* Opção Plano Básico */}
              <div 
                onClick={() => !isLocked && setSelectedPlan('basic')}
                className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col justify-between ${
                  selectedPlan === 'basic' 
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-900/10' 
                    : 'border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-emerald-400">Plano BÁSICO</strong>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-900/30 px-1.5 py-0.5 rounded">10% OFF</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">Ideal para microempresas. **Até 10 viagens/mês**. 10% de desconto no frete base e seguro de carga incluso.</p>
                </div>
                <div className="text-right mt-4 flex justify-between items-end">
                  <span className="text-[10px] text-emerald-400 font-mono">🛡️ Até 10 viagens</span>
                  <span className="font-bold text-sm text-emerald-300">R$ 350,00/mês</span>
                </div>
              </div>

              {/* Opção Plano Premium */}
              <div 
                onClick={() => !isLocked && setSelectedPlan('premium')}
                className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col justify-between relative overflow-hidden ${
                  selectedPlan === 'premium' 
                    ? 'border-brand-secondary bg-blue-950/20 shadow-md shadow-blue-900/10' 
                    : 'border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
                }`}
              >
                <div className="absolute top-0 right-0 bg-brand-secondary text-brand-dark font-bold text-[8px] px-2 py-0.5 uppercase tracking-wider rounded-bl">Recomendado</div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-brand-secondary">Plano PREMIUM</strong>
                    <span className="text-xs text-brand-secondary font-bold bg-blue-900/30 px-1.5 py-0.5 rounded">20% OFF</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">Médias redes. **Até 25 viagens/mês**. 20% OFF no frete, **15% OFF paradas extras** e telemetria IoT ativa.</p>
                </div>
                <div className="text-right mt-4 flex justify-between items-end">
                  <span className="text-[10px] text-brand-secondary font-mono">📡 IoT + 15% Paradas</span>
                  <span className="font-bold text-sm text-brand-secondary">R$ 435,00/mês</span>
                </div>
              </div>

              {/* Opção Plano Gold */}
              <div 
                onClick={() => !isLocked && setSelectedPlan('gold')}
                className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col justify-between ${
                  selectedPlan === 'gold' 
                    ? 'border-brand-primary bg-amber-950/20 shadow-md shadow-amber-900/10' 
                    : 'border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-brand-primary">Plano GOLD</strong>
                    <span className="text-xs text-brand-primary font-bold bg-amber-900/30 px-1.5 py-0.5 rounded">30% OFF</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans font-sans">Alta escala. **Viagens ilimitadas**. 30% OFF no frete, **25% OFF paradas extras** e suporte corporativo dedicado.</p>
                </div>
                <div className="text-right mt-4 flex justify-between items-end">
                  <span className="text-[10px] text-brand-primary font-mono">👑 Viagens Ilimitadas</span>
                  <span className="font-bold text-sm text-brand-primary">R$ 600,00/mês</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary flex items-center gap-2">
              <ShoppingCart size={20} /> 5. Contratação de Equipamentos
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
                  <span>Adicional KM (&gt;50km):</span>
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
                  <span className="truncate pr-4 flex items-center gap-1"><ShieldCheck size={14}/> Seguro de Carga</span>
                  <span>{selectedPlan !== 'none' ? 'Grátis (Incluso)' : `R$ ${insuranceFee.toFixed(2)}`}</span>
                </div>
              )}

              {freightDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>Desconto de Frete ({selectedPlan === 'basic' ? '10%' : selectedPlan === 'premium' ? '20%' : '30%'}):</span>
                  <span>- R$ {freightDiscount.toFixed(2)}</span>
                </div>
              )}

              {stopsDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>Desconto Paradas ({selectedPlan === 'premium' ? '15%' : '25%'}):</span>
                  <span>- R$ {stopsDiscount.toFixed(2)}</span>
                </div>
              )}

              {selectedPlan !== 'none' && (
                <div className="flex justify-between items-center text-slate-400 text-xs border border-slate-800 p-2 rounded bg-slate-950/40">
                  <span>Assinatura Mensal:</span>
                  <span className="font-bold text-slate-300">R$ {selectedPlan === 'basic' ? '350,00' : selectedPlan === 'premium' ? '435,00' : '600,00'} / mês</span>
                </div>
              )}

              <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                <span className="text-slate-200 font-bold text-lg">Custo Viagem:</span>
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
