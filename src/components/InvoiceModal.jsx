import React from 'react';
import { FileText, Receipt, CheckCircle, MapPin, Package, ShieldCheck, X } from 'lucide-react';

export default function InvoiceModal({ savedData, onAccept, onClose }) {
  const { totals, stopsCount, routeDistance, fleetCart, stopAllocations } = savedData;

  const dateStr = new Date().toLocaleDateString('pt-BR');
  const timeStr = new Date().toLocaleTimeString('pt-BR');
  const invoiceNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-50 text-slate-900 rounded-lg shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto font-mono relative">
        
        {/* Header da Nota */}
        <div className="p-6 border-b border-dashed border-slate-300 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
            <X size={24} />
          </button>
          <Receipt size={40} className="mx-auto text-slate-700 mb-2" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Nota Fiscal de Serviço</h2>
          <p className="text-xs text-slate-500">Documento Auxiliar - SIT - Sistema Inteligente de Transporte</p>
          
          <div className="mt-4 text-left text-xs border border-slate-200 p-2 rounded bg-white">
            <p><strong>Nº:</strong> {invoiceNumber}</p>
            <p><strong>Data de Emissão:</strong> {dateStr} às {timeStr}</p>
            <p><strong>Tomador:</strong> Indústria Batista / Bella The</p>
          </div>
        </div>

        {/* Corpo da Nota */}
        <div className="p-6 space-y-4 text-sm">
          
          {/* Sessao 1: Rota */}
          <div>
            <h3 className="font-bold border-b border-slate-200 pb-1 mb-2 uppercase text-xs flex items-center gap-1"><MapPin size={14}/> Detalhes da Rota</h3>
            <div className="flex justify-between"><span>Distância Total:</span> <span>{routeDistance} km</span></div>
            <div className="flex justify-between"><span>Total de Paradas:</span> <span>{stopsCount} filiais</span></div>
          </div>

          {/* Sessao 2: Veículos e Frete */}
          <div>
            <h3 className="font-bold border-b border-slate-200 pb-1 mb-2 uppercase text-xs flex items-center gap-1"><Package size={14}/> Composição de Frete</h3>
            <div className="flex justify-between">
              <span>Custo Base (Veículos):</span> 
              <span>{savedData.isAutonomous ? "R$ 0,00 (Autônomo)" : `R$ ${totals.baseFreight.toFixed(2)}`}</span>
            </div>
            {totals.stopsCost > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Taxa Paradas Extras ({stopsCount - 1}x R$100):</span> 
                <span>R$ {totals.stopsCost.toFixed(2)}</span>
              </div>
            )}
            {totals.extraKmCost > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Adicional de KM (&gt;50km):</span> 
                <span>R$ {totals.extraKmCost.toFixed(2)}</span>
              </div>
            )}
            {totals.freightDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Desconto Assinatura ({savedData.selectedPlan === 'basic' ? '10%' : savedData.selectedPlan === 'premium' ? '20%' : '30%'}):</span>
                <span>- R$ {totals.freightDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Sessao 3: Equipamentos e Adicionais */}
          <div>
            <h3 className="font-bold border-b border-slate-200 pb-1 mb-2 uppercase text-xs flex items-center gap-1"><ShieldCheck size={14}/> Insumos e Seguro</h3>
            <div className="flex justify-between">
              <span>Equipamentos Térmicos (EPP/Gelox):</span> 
              <span>R$ {totals.equipTotal.toFixed(2)}</span>
            </div>
            {savedData.selectedPlan !== 'none' ? (
              <div className="flex justify-between text-emerald-600">
                <span>Seguro Carga ({savedData.selectedPlan.toUpperCase()}):</span> 
                <span>Grátis (Incluso)</span>
              </div>
            ) : totals.insuranceFee > 0 ? (
              <div className="flex justify-between">
                <span>Seguro 100% Integridade (1.5%):</span> 
                <span>R$ {totals.insuranceFee.toFixed(2)}</span>
              </div>
            ) : null}
          </div>
          
          {/* Total */}
          <div className="pt-4 border-t-2 border-dashed border-slate-400 mt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>TOTAL A PAGAR:</span>
              <span>R$ {totals.finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="text-center text-xs text-slate-400 mt-6 pb-2">
            * Orçamento gerado via Motor de Regras IA. <br/>
            Validade: 24 horas.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-200 p-4 rounded-b-lg">
          <button 
            onClick={onAccept}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded uppercase tracking-wider flex justify-center items-center gap-2 transition-colors"
          >
            <CheckCircle size={20} /> Aprovar Orçamento e Avançar
          </button>
        </div>
      </div>
    </div>
  );
}
