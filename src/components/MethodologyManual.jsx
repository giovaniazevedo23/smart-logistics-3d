import React from 'react';
import { X, Layers, Route, Box, ScanLine } from 'lucide-react';

export default function MethodologyManual({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-dark border border-brand-secondary/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="bg-brand-card p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="text-brand-primary" /> Metodologia C.A.S.A.
            </h2>
            <p className="text-slate-400 text-sm">Carga Agrupada Sequencial Organizada (Método FIFO-Color)</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-blue-200 text-sm">
            <strong>Objetivo:</strong> Organizar os pães congelados dentro do veículo utilitário de forma rápida, sem erros e garantindo a preservação térmica (-18°C), através de um método visual intuitivo.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Passo 1 */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 font-bold px-3 py-1 rounded-bl-lg text-xs">Passo 1</div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Box className="text-brand-secondary" /> Identificação por Cores
              </h3>
              <p className="text-slate-400 text-sm mb-4">Cada filial possui uma cor oficial de etiqueta. Isso elimina a leitura de Notas Fiscais durante a descarga.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> <strong>Amarelo:</strong> Loja 1 (2 caixas)</li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> <strong>Vermelho:</strong> Loja 2 (3 caixas)</li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> <strong>Verde:</strong> Loja 3 (3 caixas)</li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> <strong>Azul:</strong> Loja 4 (3 caixas)</li>
              </ul>
            </div>

            {/* Passo 2 */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 font-bold px-3 py-1 rounded-bl-lg text-xs">Passo 2</div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Route className="text-brand-secondary" /> Organização Inversa (LIFO)
              </h3>
              <p className="text-slate-400 text-sm mb-4">As caixas são arrumadas no baú em ordem inversa à rota. A primeira loja a receber é a última a ser carregada.</p>
              <div className="bg-slate-900 p-3 rounded text-sm text-slate-300 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-700 pb-1">
                  <span>Fundo do Veículo (Últimas)</span>
                  <span className="flex gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div><div className="w-3 h-3 bg-red-500 rounded-sm"></div></span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Porta do Veículo (Primeiras)</span>
                  <span className="flex gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div><div className="w-3 h-3 bg-amber-400 rounded-sm"></div></span>
                </div>
              </div>
              <p className="text-xs text-amber-500 mt-3 font-semibold">Regra: A caixa que vai sair no próximo ponto deve estar sempre acessível.</p>
            </div>

            {/* Passo 3 */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 font-bold px-3 py-1 rounded-bl-lg text-xs">Passo 3</div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="text-brand-secondary" /> Blocos de Frio Estáveis
              </h3>
              <p className="text-slate-400 text-sm mb-3">As caixas térmicas (EPP) são empilhadas em blocos compactos para evitar balanço no trajeto.</p>
              <p className="text-slate-400 text-sm">Placas de <strong>Gelox</strong> são posicionadas no <strong>topo e nas laterais</strong> de cada bloco, pois o ar frio desce naturalmente, criando um microclima.</p>
            </div>

            {/* Passo 4 */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 font-bold px-3 py-1 rounded-bl-lg text-xs">Passo 4</div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ScanLine className="text-brand-secondary" /> Check-in/out por QR Code
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><strong>No CD (Carga):</strong> Operador bipe a caixa na saída do freezer. O sistema confirma o embarque total da filial.</li>
                <li><strong>Na Filial (Descarga):</strong> O atendente escaneia a caixa na porta. A entrega é validada em menos de 30s, preservando a temperatura do baú.</li>
              </ul>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex justify-end bg-brand-card rounded-b-2xl">
          <button 
            onClick={onClose}
            className="bg-brand-primary text-brand-dark px-6 py-2 rounded-lg font-bold hover:bg-amber-500 transition-colors"
          >
            Entendido, fechar manual
          </button>
        </div>
      </div>
    </div>
  );
}
