import React from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldX, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function SwotTab({ questionnaireResult }) {
  if (!questionnaireResult) {
    return (
      <div className="bg-brand-card rounded-xl p-12 border border-slate-800 shadow-xl text-center">
        <Target className="text-slate-600 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-400">Matriz SWOT Bloqueada</h2>
        <p className="text-slate-500 mt-2">Você precisa concluir o Diagnóstico Operacional (Etapa 2) para o sistema gerar a sua Matriz Estratégica.</p>
      </div>
    );
  }

  const { answers, severity, status } = questionnaireResult;
  const isRisk = severity !== 'Baixo';

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
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" /> Dimensionamento da frota leve ({answers.veiculo === 'fiorino' ? 'Fiorino' : 'VUC'}), garantindo excelente custo-benefício.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" /> Uso de {answers.conservacao === 'opcao_a' ? 'frio passivo (Placas Eutéticas) de alto rendimento' : 'refrigeração'}, adequado à distribuição urbana.
            </li>
            {answers.conferencia === 'digital' && (
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-500 flex-shrink-0" /> Conferência ágil via QR Code reduz o tempo de porta aberta nos PDVs.
              </li>
            )}
          </ul>
        </div>

        {/* Fraquezas */}
        <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-xl">
          <h3 className="text-orange-400 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="bg-orange-500/20 p-2 rounded-lg">F</span> Fraquezas (Weaknesses)
          </h3>
          <ul className="space-y-3 text-orange-100/80 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> Restrição severa de tempo (Transit Time) devido à sensibilidade térmica do Pão Francês Cru.
            </li>
            {answers.sensores === 'nao' && (
              <li className="flex items-start gap-2 text-orange-300">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> A medição manual de temperatura impede a ação preditiva durante a viagem.
              </li>
            )}
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
            {answers.demanda === 'padrao' && (
              <li className="flex items-start gap-2">
                <TrendingUp size={16} className="mt-0.5 flex-shrink-0" /> A padronização da carga (1.694 unidades) permite previsibilidade perfeita de espaço e roteiro.
              </li>
            )}
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
            {answers.horario === 'comercial' && (
              <li className="flex items-start gap-2 text-rose-300">
                <ShieldX size={16} className="mt-0.5 flex-shrink-0" /> A escolha da Janela Comercial expõe a frota a longos engarrafamentos e calor elevado.
              </li>
            )}
            {isRisk && (
              <li className="flex items-start gap-2 text-rose-300 font-semibold bg-rose-900/40 p-2 rounded">
                <ShieldX size={16} className="mt-0.5 flex-shrink-0" /> STATUS: {status}. Há falhas severas na estratégia configurada para este frete.
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
          {answers.horario === 'comercial' && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <strong className="text-white block mb-1">Dica Estratégica (Janela Comercial):</strong>
              <p className="text-slate-300 text-sm">Ajustar a janela de carregamento para as 05:30 (Off-Peak). Isso evita a retenção no trânsito urbano matutino, otimizando o consumo de combustível e preservando a placa eutética.</p>
            </div>
          )}
          
          {answers.conservacao === 'opcao_c' && (
             <div className="bg-rose-900/20 p-4 rounded-lg border border-rose-500/50">
               <strong className="text-rose-400 block mb-1">Ação Mitigadora Crítica (Acondicionamento):</strong>
               <p className="text-slate-300 text-sm">O transporte em caixas plásticas abertas vai destruir o produto. Adicione caixas isotérmicas EPP e pelo menos 2 placas de Gelox congeladas a -20°C por caixa imediatamente.</p>
             </div>
          )}

          {!isRisk && answers.horario === 'off_peak' && (
            <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/50">
               <strong className="text-emerald-400 block mb-1">Manutenção de Padrão Lean:</strong>
               <p className="text-slate-300 text-sm">A estratégia está ótima! A prioridade agora é garantir que as filiais confirmem o recebimento do alerta de Geofencing para descarregar os pães em menos de 10 minutos por ponto, aproveitando o tráfego favorável.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
