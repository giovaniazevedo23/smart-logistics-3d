import React, { useState } from 'react';
import { Map, ClipboardList, Target } from 'lucide-react';
import TrackingTab from './components/TrackingTab';
import QuestionnaireTab from './components/QuestionnaireTab';
import SwotTab from './components/SwotTab';
import { CURRENT_TRIP } from './data/bakeryData';

function App() {
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'questionnaire' | 'swot'
  const [questionnaireResult, setQuestionnaireResult] = useState(null);

  return (
    <div className="min-h-screen bg-brand-dark p-6">
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
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tracking' 
                ? 'bg-brand-primary text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Map size={20} /> [1] Rastreio & Rota Otimizada
          </button>
          
          <button 
            onClick={() => setActiveTab('questionnaire')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'questionnaire' 
                ? 'bg-brand-secondary text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardList size={20} /> [2] Diagnóstico Operacional
          </button>
          
          <button 
            onClick={() => setActiveTab('swot')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'swot' 
                ? 'bg-emerald-500 text-brand-dark shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Target size={20} /> [3] Matriz SWOT & Plano de Ação
          </button>
        </div>

        {/* Tab Content Rendering */}
        <main>
          {activeTab === 'tracking' && (
            <TrackingTab />
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
        </main>

      </div>
    </div>
  );
}

export default App;
