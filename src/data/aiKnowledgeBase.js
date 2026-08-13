// Motor de Conhecimento e Aprendizado da IA
export const INITIAL_AI_FEEDBACKS = [
  {
    id: 'fb-01',
    companyId: 'coldchain-express',
    user: 'Dr. Roberto Mendes (Instituto BioTech)',
    date: '2026-08-01',
    rating: 5,
    category: 'Manutenção Térmica',
    comment: 'Entrega impecável! As 1.200 doses de vacina mantiveram exatamente -19.5°C durante todo o trajeto. O baú frigorífico ThermoKing foi super eficiente.',
    impactOnAI: 'Score de confiabilidade térmica da ColdChain incrementado em +4%. Recomendação de manter mesma calibração de compressor.'
  },
  {
    id: 'fb-02',
    companyId: 'oceanic-intermodal',
    user: 'Mariana Silva (Exportadora Hortifrúti)',
    date: '2026-07-28',
    rating: 4,
    category: 'Variação nas Portas',
    comment: 'A carga de mangas chegou em ótimo estado, mas notamos uma breve elevação de umidade quando o contêiner esteve no pátio de transbordo.',
    impactOnAI: 'Alerta gerado para requerer manta térmica reforçada nos transbordos de Santos.'
  }
];

export const processAIFeedback = (currentCompany, feedbackData, existingFeedbacks) => {
  const newFeedback = {
    id: `fb-${Date.now()}`,
    companyId: currentCompany.id,
    user: feedbackData.userName || 'Cliente Verificado',
    date: new Date().toISOString().split('T')[0],
    rating: Number(feedbackData.rating),
    category: feedbackData.category,
    comment: feedbackData.comment,
    impactOnAI: ''
  };

  let riskScoreDelta = 0;
  let newInsight = '';
  let newPlan = '';

  if (newFeedback.rating >= 4) {
    riskScoreDelta = -5; // Reduz o risco
    newInsight = `Feedback positivo (${newFeedback.rating}★) sobre "${feedbackData.category}": confirma eficácia dos isolamentos térmicos.`;
    newPlan = `Replicar o procedimento operacional utilizado por ${currentCompany.name} para futuros carregamentos desta rota.`;
  } else {
    riskScoreDelta = +12; // Aumenta alerta de risco
    newInsight = `Feedback crítico (${newFeedback.rating}★) alertando para "${feedbackData.category}": ${feedbackData.comment}`;
    newPlan = `PLANO PREVENTIVO DE EMERGÊNCIA: Inspecionar vedação de borrachas e sensores adicionais antes do próximo percurso.`;
  }

  newFeedback.impactOnAI = `IA atualizada: Ajuste no cálculo de risco (${riskScoreDelta > 0 ? '+' : ''}${riskScoreDelta}%). Novo plano de mitigação adicionado ao sistema.`;

  // Calcular novo risco
  const oldScoreNum = parseInt(currentCompany.aiForecast.riskScore);
  const updatedScoreNum = Math.max(2, Math.min(95, oldScoreNum + riskScoreDelta));

  const updatedCompany = {
    ...currentCompany,
    aiForecast: {
      ...currentCompany.aiForecast,
      riskScore: `${updatedScoreNum}%`,
      riskLevel: updatedScoreNum > 40 ? 'Elevado Risco' : updatedScoreNum > 20 ? 'Risco Moderado' : 'Baixo Risco',
      insights: [newInsight, ...currentCompany.aiForecast.insights],
      preventivePlans: [newPlan, ...currentCompany.aiForecast.preventivePlans]
    }
  };

  return {
    updatedCompany,
    updatedFeedbacks: [newFeedback, ...existingFeedbacks]
  };
};
