import React, { useState } from 'react';
import { ClipboardCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function QuestionnaireTab({ setQuestionnaireResult, setActiveTab }) {
  const [answers, setAnswers] = useState({
    placasEuteticas: '',
    tempoTolerancia: '',
    taxaOcupacao: ''
  });

  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate if any is "No"
    const hasRisk = Object.values(answers).some(val => val === 'no');
    const finalResult = hasRisk ? 'risks' : 'approved';
    setResult(finalResult);
    setQuestionnaireResult(finalResult);
  };

  return (
    <div className="bg-brand-card rounded-xl p-8 border border-slate-800 shadow-xl max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
        <ClipboardCheck className="text-brand-primary" size={32} />
        <div>
          <h2 className="text-2xl font-bold">Diagnóstico Logístico Estratégico</h2>
          <p className="text-slate-400">Validação dos 3 pilares fundamentais da cadeia do frio antes da rota.</p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1 */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2">1. Acondicionamento Térmico</h3>
            <p className="text-slate-400 mb-4 text-sm">As placas eutéticas (Gelox) estão devidamente congeladas (-20°C) e acondicionadas nas caixas térmicas sem fissuras?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" required name="placas" value="yes" onChange={() => setAnswers(p => ({...p, placasEuteticas: 'yes'}))} className="w-4 h-4 text-brand-primary bg-slate-900 border-slate-700" />
                <span>Sim, validadas.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" required name="placas" value="no" onChange={() => setAnswers(p => ({...p, placasEuteticas: 'no'}))} className="w-4 h-4 text-brand-primary bg-slate-900 border-slate-700" />
                <span>Não, encontrei problemas.</span>
              </label>
            </div>
          </div>

          {/* Question 2 */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2">2. Tempo de Trânsito & Tolerância</h3>
            <p className="text-slate-400 mb-4 text-sm">O tempo estimado da rota até a Filial 4 obedece a janela térmica de segurança (evitando que a massa passe de -10°C)?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" required name="tempo" value="yes" onChange={() => setAnswers(p => ({...p, tempoTolerancia: 'yes'}))} className="w-4 h-4 text-brand-primary bg-slate-900 border-slate-700" />
                <span>Sim, rota dentro da janela térmica.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" required name="tempo" value="no" onChange={() => setAnswers(p => ({...p, tempoTolerancia: 'no'}))} className="w-4 h-4 text-brand-primary bg-slate-900 border-slate-700" />
                <span>Não, risco de trânsito estender a viagem.</span>
              </label>
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2">3. Capacidade de Manuseio</h3>
            <p className="text-slate-400 mb-4 text-sm">A taxa de ocupação da carga de 1.694 unidades está correta para o veículo Fiorino e há equipe pronta para descarregamento imediato nas filiais?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" required name="capacidade" value="yes" onChange={() => setAnswers(p => ({...p, taxaOcupacao: 'yes'}))} className="w-4 h-4 text-brand-primary bg-slate-900 border-slate-700" />
                <span>Sim, dimensionado.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" required name="capacidade" value="no" onChange={() => setAnswers(p => ({...p, taxaOcupacao: 'no'}))} className="w-4 h-4 text-brand-primary bg-slate-900 border-slate-700" />
                <span>Não, faltam informações de recepção.</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-brand-secondary hover:bg-blue-400 text-brand-dark font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Validar Conformidade
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-12">
          {result === 'approved' ? (
            <div className="inline-flex flex-col items-center">
              <CheckCircle2 size={80} className="text-emerald-500 mb-6" />
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">Plano Aprovado</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">Todos os pilares operacionais validados. O veículo está pronto para iniciar a distribuição.</p>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center">
              <ShieldAlert size={80} className="text-rose-500 mb-6" />
              <h2 className="text-3xl font-bold text-rose-400 mb-2">Plano com Riscos Identificados</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">Inconsistências encontradas na checagem. Aconselhamos rever a estratégia antes do despacho.</p>
            </div>
          )}
          
          <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={() => setResult(null)}
              className="px-6 py-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Refazer Check-list
            </button>
            <button 
              onClick={() => setActiveTab('swot')}
              className="bg-brand-primary hover:bg-amber-500 text-brand-dark font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Gerar Relatório Estratégico (SWOT)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
