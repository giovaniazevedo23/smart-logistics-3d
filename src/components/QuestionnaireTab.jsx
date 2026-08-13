import React, { useState } from 'react';
import { ClipboardCheck, ShieldAlert, CheckCircle2, Truck, Lightbulb, Clock, Map, MapPin } from 'lucide-react';

export default function QuestionnaireTab({ setQuestionnaireResult, setActiveTab }) {
  const [answers, setAnswers] = useState({
    origem: 'Centro de Distribuição (Polo Industrial)',
    destino: 'Filiais Bella THE (Teresina-PI)',
    demanda: 'padrao',
    acondicionamento: 'aprovado',
    conservacao: 'opcao_a',
    sensores: 'sim',
    veiculo: 'fiorino',
    horario: 'off_peak',
    notificacao: 'sim',
    conferencia: 'digital'
  });

  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcula o risco
    let riskLevel = 0;
    if (answers.acondicionamento === 'alerta') riskLevel += 1;
    if (answers.conservacao === 'opcao_c') riskLevel += 2;
    if (answers.conservacao === 'opcao_b') riskLevel += 1;
    if (answers.horario === 'comercial') riskLevel += 1;
    if (answers.sensores === 'nao') riskLevel += 1;

    let finalStatus = 'Aprovado';
    let severity = 'Baixo';
    
    if (riskLevel >= 3) {
      finalStatus = 'Reprovado (Risco Térmico Crítico)';
      severity = 'Alto';
    } else if (riskLevel > 0) {
      finalStatus = 'Aprovado com Ressalva (Risco Térmico Médio)';
      severity = 'Médio';
    }

    const payload = {
      status: finalStatus,
      severity,
      answers,
      timeEst: answers.horario === 'comercial' ? '65 minutos' : '48 minutos',
      vehicle: answers.veiculo === 'fiorino' ? 'Utilitário Leve (Fiorino)' : 'VUC / Baú Refrigerado'
    };

    setResult(payload);
    setQuestionnaireResult(payload);
  };

  const handleChange = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-brand-card rounded-xl p-8 border border-slate-800 shadow-xl max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
        <ClipboardCheck className="text-brand-primary" size={32} />
        <div>
          <h2 className="text-2xl font-bold">Diagnóstico Logístico Estratégico</h2>
          <p className="text-slate-400">Onboarding do Frete: Valide a operação antes de liberar a rota otimizada.</p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ETAPA 0 */}
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary border-b border-slate-700 pb-2 flex items-center gap-2">
              <Map size={20} className="text-amber-400" /> Etapa 0: Configuração Geográfica (Rota)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold mb-2 text-sm text-slate-200 block">Endereço de Origem (CD):</label>
                <input 
                  type="text" 
                  value={answers.origem} 
                  onChange={(e) => handleChange('origem', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="Ex: Polo Industrial Sul"
                  required
                />
              </div>
              <div>
                <label className="font-semibold mb-2 text-sm text-slate-200 block">Região de Destino (Filiais):</label>
                <input 
                  type="text" 
                  value={answers.destino} 
                  onChange={(e) => handleChange('destino', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="Ex: Teresina - PI"
                  required
                />
              </div>
            </div>
          </div>

          {/* ETAPA 1 */}
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary border-b border-slate-700 pb-2 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400" /> Etapa 1: Prescrição de Veículo e Acondicionamento
            </h3>
            
            <div className="mb-6 bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg">
              <p className="text-sm text-slate-300">
                <strong className="text-brand-primary block mb-1">Assistente Inteligente (Recomendação Prescritiva):</strong>
                "Para esta carga planejada de 85 kg (1.694 unidades), o melhor transporte é um Utilitário Leve (ex: Fiorino/Kangoo) com Baú Isotérmico e Caixas Térmicas EPP com Placas Eutéticas (Gelox a -20°C). Isso reduz os custos de frete em 60% comparado a caminhões pesados."
              </p>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-slate-200">1. Confirmar o veículo e acondicionamento selecionado para a expedição:</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="demanda" value="padrao" checked={answers.demanda === 'padrao'} onChange={() => handleChange('demanda', 'padrao')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-slate-200">Carga Padrão Semanal:</strong> 1.694 unidades (~85 kg distribuídos entre as Loja 1: 309, Loja 2: 460, Loja 3: 410, Loja 4: 515).</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="demanda" value="ajustada" checked={answers.demanda === 'ajustada'} onChange={() => handleChange('demanda', 'ajustada')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-slate-200">Carga Parcial / Ajustada:</strong> Definição customizada.</span>
              </label>
            </div>

            <div>
              <p className="font-semibold mb-2 text-sm text-slate-200">2. Como a carga foi acondicionada e identificada na expedição?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="acondicionamento" value="aprovado" checked={answers.acondicionamento === 'aprovado'} onChange={() => handleChange('acondicionamento', 'aprovado')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-emerald-400">Aprovado:</strong> Caixas plásticas/isotérmicas com cores/etiquetas de QR Code exclusivas por filial.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="acondicionamento" value="alerta" checked={answers.acondicionamento === 'alerta'} onChange={() => handleChange('acondicionamento', 'alerta')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-rose-400">Alerta:</strong> Caixas misturadas com pães de filiais diferentes na mesma caixa.</span>
              </label>
            </div>
          </div>

          {/* ETAPA 2 */}
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary border-b border-slate-700 pb-2 flex items-center gap-2">
              <Clock size={20} className="text-amber-400" /> Etapa 2: Pré-Controle Obrigatório de Temperatura
            </h3>
            
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-slate-200">3. A temperatura da câmara fria no CD foi validada antes da liberação?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="conservacao" value="opcao_a" checked={answers.conservacao === 'opcao_a'} onChange={() => handleChange('conservacao', 'opcao_a')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-emerald-400">Sim:</strong> A câmara encontra-se a -18°C. Liberação térmica autorizada.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="conservacao" value="opcao_c" checked={answers.conservacao === 'opcao_c'} onChange={() => handleChange('conservacao', 'opcao_c')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-rose-400">Não (Crítico):</strong> Câmara acima de -10°C, risco de quebra da cadeia do frio antes da expedição.</span>
              </label>
            </div>

            <div>
              <p className="font-semibold mb-2 text-sm text-slate-200">4. Os sensores IoT Bluetooth (BLE) já foram pareados com as caixas?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="sensores" value="sim" checked={answers.sensores === 'sim'} onChange={() => handleChange('sensores', 'sim')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-slate-200">Sim:</strong> Sensores ativos enviando telemetria.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="sensores" value="nao" checked={answers.sensores === 'nao'} onChange={() => handleChange('sensores', 'nao')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-slate-200">Não:</strong> Medição manual via termômetro de espeto.</span>
              </label>
            </div>
          </div>

          {/* ETAPA 3 */}
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary border-b border-slate-700 pb-2">Etapa 3: Logística e Roteirização</h3>
            
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-slate-200">5. Qual veículo será utilizado para a rota?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="veiculo" value="fiorino" checked={answers.veiculo === 'fiorino'} onChange={() => handleChange('veiculo', 'fiorino')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-slate-200">Utilitário Leve (Fiorino/Kangoo):</strong> Baixo custo por km, agilidade no trânsito.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="veiculo" value="vuc" checked={answers.veiculo === 'vuc'} onChange={() => handleChange('veiculo', 'vuc')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-slate-200">VUC / Baú Refrigerado:</strong> Carga maior, maior consumo de combustível.</span>
              </label>
            </div>

            <div>
              <p className="font-semibold mb-2 text-sm text-slate-200">6. Qual é o horário programado para a saída?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="horario" value="off_peak" checked={answers.horario === 'off_peak'} onChange={() => handleChange('horario', 'off_peak')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-emerald-400">Janela Off-Peak (05:00 - 07:00):</strong> Menor tráfego e calor.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="horario" value="comercial" checked={answers.horario === 'comercial'} onChange={() => handleChange('horario', 'comercial')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-amber-400">Janela Comercial (08:00 - 18:00):</strong> Sujeito a congestionamentos.</span>
              </label>
            </div>
          </div>

          {/* ETAPA 4 */}
          <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary border-b border-slate-700 pb-2 flex items-center gap-2">
              <ClipboardCheck size={20} className="text-amber-400" /> Etapa 4: Checklist de Agilidade (Carga/Descarga)
            </h3>
            
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-slate-200">7. As equipes de loja confirmaram a prontidão para receber o lote em menos de 8 minutos?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="notificacao" value="sim" checked={answers.notificacao === 'sim'} onChange={() => handleChange('notificacao', 'sim')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-emerald-400">Sim:</strong> Equipes de prontidão e espaço reservado nos freezers via aviso de Geofencing.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="notificacao" value="nao" checked={answers.notificacao === 'nao'} onChange={() => handleChange('notificacao', 'nao')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-amber-400">Não:</strong> Risco de exposição ao ambiente externo durante a espera pela equipe da loja.</span>
              </label>
            </div>

            <div>
              <p className="font-semibold mb-2 text-sm text-slate-200">8. A conferência digital por QR Code (Proof of Delivery) está configurada?</p>
              <label className="flex items-start gap-2 cursor-pointer mb-2">
                <input type="radio" required name="conferencia" value="digital" checked={answers.conferencia === 'digital'} onChange={() => handleChange('conferencia', 'digital')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-emerald-400">Digital:</strong> Escaneamento ágil ativado (Evita a contagem manual na doca).</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" required name="conferencia" value="manual" checked={answers.conferencia === 'manual'} onChange={() => handleChange('conferencia', 'manual')} className="mt-1" />
                <span className="text-sm text-slate-400"><strong className="text-amber-400">Manual:</strong> Contagem física das unidades na recepção (Lento).</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-brand-secondary hover:bg-blue-400 text-brand-dark font-bold py-4 px-8 rounded-lg text-lg transition-colors w-full md:w-auto shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              Gerar e Validar Plano Estratégico
            </button>
          </div>
        </form>
      ) : (
        <div className="py-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            <div className={`p-4 border-b ${result.severity === 'Baixo' ? 'bg-emerald-900/30 border-emerald-500/50' : result.severity === 'Médio' ? 'bg-amber-900/30 border-amber-500/50' : 'bg-rose-900/30 border-rose-500/50'}`}>
              <h3 className="font-bold text-xl flex items-center gap-2 text-white">
                {result.severity === 'Baixo' ? <CheckCircle2 className="text-emerald-400" /> : <ShieldAlert className={result.severity === 'Médio' ? 'text-amber-400' : 'text-rose-400'} />} 
                Status do Plano Logístico: <span className={result.severity === 'Baixo' ? 'text-emerald-400' : result.severity === 'Médio' ? 'text-amber-400' : 'text-rose-400'}>{result.status}</span>
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-lg">
                  <Truck className="text-brand-secondary" />
                  <div>
                    <div className="text-xs text-slate-400">Veículo Alocado</div>
                    <div className="font-bold">{result.vehicle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-lg">
                  <ClipboardCheck className="text-brand-secondary" />
                  <div>
                    <div className="text-xs text-slate-400">Carga Total</div>
                    <div className="font-bold">1.694 Pães (~85 kg)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-lg">
                  <Clock className="text-brand-secondary" />
                  <div>
                    <div className="text-xs text-slate-400">Tempo Estimado em Trânsito</div>
                    <div className="font-bold">{result.timeEst} (Rota Otimizada)</div>
                  </div>
                </div>
              </div>

              <div className="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg flex items-start gap-3">
                <Lightbulb className="text-brand-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-brand-primary block mb-1">Dica de Solução do Sistema:</strong>
                  <p className="text-sm text-slate-300">
                    {result.answers.horario === 'off_peak' 
                      ? "Como a saída ocorrerá na janela Off-Peak (05h00), o sistema ativou o alerta de pré-chegada via Geofencing garantindo descargas rápidas com menor impacto térmico."
                      : "Como a saída ocorrerá no horário comercial (tráfego moderado/alto), o sistema ativou o alerta de Geofencing para as filiais liberarem as docas com antecedência e recomenda adicionar +2 placas de Gelox por caixa térmica."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 border-t border-slate-800 pt-8">
            <button 
              onClick={() => setActiveTab('tracking')}
              className="bg-brand-secondary hover:bg-blue-400 text-brand-dark font-bold px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Liberar Rota Otimizada
            </button>
            <button 
              onClick={() => setActiveTab('swot')}
              className="bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-bold px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Ver Matriz SWOT Completa
            </button>
            <button 
              onClick={() => {
                setResult(null);
                setQuestionnaireResult(null);
              }}
              className="px-6 py-4 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Refazer Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
