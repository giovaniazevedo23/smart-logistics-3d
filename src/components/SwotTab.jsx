import React from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldX, Lightbulb } from 'lucide-react';

export default function SwotTab({ questionnaireResult }) {
  const isRisk = questionnaireResult === 'risks';

  return (
    <div className="bg-brand-card rounded-xl p-8 border border-slate-800 shadow-xl max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
        <Target className="text-brand-primary" size={32} />
        <div>
          <h2 className="text-2xl font-bold">Relatório Estratégico: Matriz SWOT / FOFA</h2>
          <p className="text-slate-400">Gerado automaticamente com base nos dados operacionais da rota e validações do gestor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Forças */}
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl">
          <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 p-2 rounded-lg">F</span> Forças (Strengths)
          </h3>
          <ul className="space-y-3 text-emerald-100/80 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle /> Dimensionamento enxuto da frota leve (Fiorino), garantindo excelente custo-benefício por quilômetro rodado.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle /> Uso eficiente do sistema de frio passivo (Placas Eutéticas) eliminando a necessidade de motores de refrigeração caros para viagens curtas.
            </li>
          </ul>
        </div>

        {/* Fraquezas */}
        <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-xl">
          <h3 className="text-orange-400 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="bg-orange-500/20 p-2 rounded-lg">F</span> Fraquezas (Weaknesses)
          </h3>
          <ul className="space-y-3 text-orange-100/80 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> Restrição severa de tempo (Transit Time curto) devido à sensibilidade térmica do Pão Francês Cru.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> Falta de pulmão térmico: se a porta do baú for mantida aberta muito tempo durante a descarga, perde-se a inércia térmica.
            </li>
          </ul>
        </div>

        {/* Oportunidades */}
        <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl">
          <h3 className="text-blue-400 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="bg-blue-500/20 p-2 rounded-lg">O</span> Oportunidades (Opportunities)
          </h3>
          <ul className="space-y-3 text-blue-100/80 text-sm">
            <li className="flex items-start gap-2">
              <TrendingUp size={16} className="mt-0.5 flex-shrink-0" /> Otimização inteligente da sequência de rotas (CD ➔ F1 ➔ F3 ➔ F2 ➔ F4) que corta 15% do tempo no trânsito.
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp size={16} className="mt-0.5 flex-shrink-0" /> O uso de Geofencing para envio de alertas prévios de chegada otimiza os recursos de recepção das filiais.
            </li>
          </ul>
        </div>

        {/* Ameaças */}
        <div className="bg-rose-900/20 border border-rose-500/30 p-6 rounded-xl">
          <h3 className="text-rose-400 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="bg-rose-500/20 p-2 rounded-lg">A</span> Ameaças (Threats)
          </h3>
          <ul className="space-y-3 text-rose-100/80 text-sm">
            <li className="flex items-start gap-2">
              <ShieldX size={16} className="mt-0.5 flex-shrink-0" /> Riscos de tráfego intenso nos grandes centros urbanos em horários de pico prejudicando o ETA.
            </li>
            {isRisk && (
              <li className="flex items-start gap-2 text-rose-300 font-semibold bg-rose-900/40 p-2 rounded">
                <ShieldX size={16} className="mt-0.5 flex-shrink-0" /> AVALIAÇÃO DE RISCO ATIVA: O plano submetido possui falhas que podem levar à quebra do isolamento térmico (-10°C).
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-slate-800/80 border border-brand-primary/50 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Lightbulb size={120} />
        </div>
        <h3 className="font-bold text-brand-primary text-xl mb-4 relative z-10 flex items-center gap-2">
          <Lightbulb /> Planos de Ação e Sugestões Inteligentes
        </h3>
        
        <div className="relative z-10 space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <strong className="text-white block mb-1">Dica Estratégica #1:</strong>
            <p className="text-slate-300 text-sm">Ajustar a janela de carregamento para as 05:30. Isso evita a retenção no trânsito urbano matutino, otimizando o consumo de combustível da Fiorino e preservando a placa eutética.</p>
          </div>
          
          {isRisk ? (
             <div className="bg-rose-900/20 p-4 rounded-lg border border-rose-500/50">
               <strong className="text-rose-400 block mb-1">Ação Mitigadora Imediata:</strong>
               <p className="text-slate-300 text-sm">Como houve reprovação em um dos pilares do diagnóstico, recomendamos o pré-resfriamento do baú utilitário a -22°C por pelo menos 1h antes do carregamento para gerar um "pulmão térmico" de segurança.</p>
             </div>
          ) : (
            <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/50">
               <strong className="text-emerald-400 block mb-1">Manutenção de Padrão:</strong>
               <p className="text-slate-300 text-sm">O plano foi aprovado. A prioridade agora é garantir que as filiais confirmem o recebimento do alerta de Geofencing para descarregar os 1.694 pães em menos de 10 minutos por ponto.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple icon for strengths
function CheckCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 mt-0.5 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  );
}
