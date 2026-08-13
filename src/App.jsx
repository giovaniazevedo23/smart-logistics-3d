import React, { useState } from 'react';
import { Package, Map, Target, ClipboardList, ShoppingCart } from 'lucide-react';
import TrackingTab from './components/TrackingTab';
import QuestionnaireTab from './components/QuestionnaireTab';
import SwotTab from './components/SwotTab';
import StoreTab from './components/StoreTab';
import { CURRENT_TRIP } from './data/bakeryData';

function App() {
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'tracking' | 'questionnaire' | 'swot'
  const [storeResult, setStoreResult] = useState(null);
  const [questionnaireResult, setQuestionnaireResult] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-brand-dark bg-blend-soft-light">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-brand-card p-6 rounded-xl border border-slate-800 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight flex items-center gap-2">
              <span className="text-3xl text-brand-secondary">❄️</span> PãoTrack <span className="text-brand-secondary font-light">| SAGA SENAI - Bella The</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gestão Lean e Rastreamento Térmico de Pão Francês Congelado</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-400">Viagem Atual</div>
            <div className="font-bold font-['JetBrains_Mono'] text-emerald-400">{CURRENT_TRIP.id}</div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-brand-card/50 p-2 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'store' 
                ? 'bg-amber-500 text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShoppingCart size={20} /> [1] Loja & Orçamento
          </button>

          <button 
            onClick={() => storeResult && setActiveTab('questionnaire')}
            disabled={!storeResult}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              !storeResult ? 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-600' :
              activeTab === 'questionnaire' 
                ? 'bg-brand-secondary text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardList size={20} /> [2] Onboarding Logístico
          </button>

          <button 
            onClick={() => questionnaireResult && setActiveTab('swot')}
            disabled={!questionnaireResult}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              !questionnaireResult ? 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-600' :
              activeTab === 'swot' 
                ? 'bg-emerald-500 text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Target size={20} /> [3] Matriz SWOT Estratégica
          </button>

          <button 
            onClick={() => questionnaireResult && setActiveTab('tracking')}
            disabled={!questionnaireResult}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              !questionnaireResult ? 'opacity-50 cursor-not-allowed bg-slate-900 text-slate-600' :
              activeTab === 'tracking' 
                ? 'bg-brand-primary text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Map size={20} /> [4] Rastreio Otimizado
          </button>
        </div>

        {/* Tab Content Rendering */}
        <main>
          {activeTab === 'store' && (
            <StoreTab 
              storeResult={storeResult} 
              setStoreResult={setStoreResult} 
              setActiveTab={setActiveTab} 
              isLocked={isLocked}
            />
          )}

          {activeTab === 'questionnaire' && (
            <QuestionnaireTab 
              setQuestionnaireResult={setQuestionnaireResult} 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'swot' && (
            <SwotTab 
              questionnaireResult={questionnaireResult}
            />
          )}

          {activeTab === 'tracking' && (
            <TrackingTab 
              onLock={() => setIsLocked(true)}
              onReset={() => setIsLocked(false)}
            />
          )}
        </main>

      </div>
    </div>
  );
}

export default App;
