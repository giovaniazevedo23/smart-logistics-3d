import React, { useState } from 'react';
import { Cpu, BrainCircuit, ShieldAlert, Sparkles, MessageSquarePlus, Star, Send, CheckCircle2, ListChecks, TrendingUp } from 'lucide-react';

export default function AIForecastPanel({
  activeCompany,
  feedbacks,
  onSubmitFeedback
}) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState('Manutenção Térmica');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const aiForecast = activeCompany.aiForecast;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitFeedback({
      userName: userName || 'Cliente Autenticado',
      category,
      rating,
      comment
    });

    setComment('');
    setShowFeedbackModal(false);
    setSuccessMessage('🤖 Feedback recebido! O modelo de IA foi re-treinado e gerou novos planos e previsões de risco.');
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  return (
    <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 18px rgba(139, 92, 246, 0.4)'
          }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Motor de IA Preditiva & Planos de Mitigação
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Planos preventivos e previsões de risco re-treinados continuamente pelo feedback dos usuários.
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowFeedbackModal(true)}
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)' }}
        >
          <MessageSquarePlus size={18} />
          Deixar Feedback (Alimentar IA)
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#6ee7b7',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={20} color="#10b981" />
          {successMessage}
        </div>
      )}

      {/* Main Grid: AI Risk Gauge & Preventive Action Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Left: AI Risk Metric Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Previsão de Risco do Percurso (IA Engine)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '14px 0 8px 0' }}>
              <span className="mono-font" style={{ fontSize: '3rem', fontWeight: 800, color: parseInt(aiForecast.riskScore) > 30 ? '#ef4444' : '#10b981', lineHeight: 1 }}>
                {aiForecast.riskScore}
              </span>
              <span className={`badge ${parseInt(aiForecast.riskScore) > 30 ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.85rem' }}>
                {aiForecast.riskLevel}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Calculado combinando leituras IoT do veículo <strong>{activeCompany.transportName}</strong> com histórico de ocorrências reportadas.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', marginTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} /> Insights de Aprendizado Preditivo:
            </div>
            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
              {aiForecast.insights.map((ins, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{ins}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: AI Preventive Action Plans */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(139, 92, 246, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListChecks size={18} color="#00f2fe" /> Planos de Ação Preventiva Gerados pela IA
            </h3>
            <span className="badge badge-purple">Plano Operacional</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aiForecast.preventivePlans.map((plan, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #8b5cf6',
                  fontSize: '0.84rem',
                  color: '#e2e8f0',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <CheckCircle2 size={18} color="#8b5cf6" style={{ shrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Diretriz IA #{idx + 1}:</strong> {plan}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Historical Feedbacks Section */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 14px 0', color: '#f8fafc' }}>
          💬 Feedback dos Usuários & Histórico de Aprendizado
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {feedbacks.filter(f => f.companyId === activeCompany.id).map((fb) => (
            <div
              key={fb.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                padding: '14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{fb.user}</strong>
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < fb.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '8px' }}>
                {fb.date} • Categoria: <strong style={{ color: '#00f2fe' }}>{fb.category}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 8px 0' }}>
                "{fb.comment}"
              </p>
              <div style={{ fontSize: '0.72rem', background: 'rgba(139, 92, 246, 0.12)', color: '#c4b5fd', padding: '6px 8px', borderRadius: '6px' }}>
                🤖 <strong>Alimento da IA:</strong> {fb.impactOnAI}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Submitting Feedback to Retrain AI */}
      {showFeedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainCircuit color="#8b5cf6" /> Novo Feedback - Alimentar Motor de IA
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Seu Nome / Empresa Contratante:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Roberto Mendes (Laboratório BioTech)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Categoria do Feedback:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Manutenção Térmica">Manutenção Térmica / Frio</option>
                    <option value="Pontualidade na Entrega">Pontualidade na Entrega</option>
                    <option value="Acondicionamento de Carga">Acondicionamento de Carga 3D</option>
                    <option value="Transbordo & Manuseio">Transbordo & Manuseio</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Nota do Percurso (1 a 5 Estrelas):
                  </label>
                  <div style={{ display: 'flex', gap: '8px', padding: '8px 0' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: star <= rating ? '#f59e0b' : '#475569'
                        }}
                      >
                        <Star size={24} fill={star <= rating ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Observações e Problemas Identificados:
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva variações observadas, estado dos paletes ou sugestões para o próximo percurso..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFeedbackModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Submeter e Re-treinar IA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
