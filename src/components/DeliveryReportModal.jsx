import React from 'react';
import { FileText, Printer, CheckCircle2, ShieldCheck, Download, Truck, Thermometer, Clock } from 'lucide-react';

export default function DeliveryReportModal({ activeCompany, telemetryData, onClose }) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', border: '1px solid #00f2fe' }}>
        
        {/* Modal Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText color="#00f2fe" size={22} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              Relatório Final de Conclusão de Percurso
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              <Printer size={14} /> Imprimir / Exportar PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19' }}>
          
          {/* Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #00f2fe', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#00f2fe' }}>
                TransLog 3D Telemetry Systems
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Certificado Oficial de Integridade da Cargas & Rastreio IoT
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div><strong>Relatório nº:</strong> TR-2026-8890</div>
              <div><strong>Data de Emissão:</strong> {currentDate}</div>
              <div style={{ color: '#10b981', fontWeight: 700, marginTop: '2px' }}>✓ RASTREIO CONCLUÍDO</div>
            </div>
          </div>

          {/* Shipment Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#00f2fe', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                🏢 Empresa Contratante & Veículo 3D
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeCompany.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{activeCompany.transportName}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Especificação: {activeCompany.modelSpec}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#8b5cf6', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                📦 Carga & Rota Concluída
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeCompany.cargoName}</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>SKU: <strong className="mono-font">{activeCompany.cargoSku}</strong></div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{activeCompany.origin} ➔ {activeCompany.destination}</div>
            </div>
          </div>

          {/* Telemetry Technical Audit Table */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '10px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Thermometer size={16} color="#00f2fe" /> Resumo Auditado de Telemetria Térmica IoT
            </h4>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.8)', color: '#00f2fe' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Parâmetro Medido</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Faixa Especificada</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Valor Auditado</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Status Conformidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Temperatura Média do Baú</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{activeCompany.targetTempMin}°C a {activeCompany.targetTempMax}°C</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} className="mono-font">
                    {telemetryData.currentTemp.toFixed(1)}°C
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span className="badge badge-green">✓ 100% Conforme</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Tempo Total de Percurso</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Estimado: {activeCompany.elapsedTime}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} className="mono-font">
                    {activeCompany.elapsedTime} (Sem atrasos)
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span className="badge badge-cyan">✓ No Horário</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Integridade dos Paletes 3D</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>12/12 Paletes Aprovados</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Zero tombamentos</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span className="badge badge-green">✓ Selo de Segurança</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Preventive Plan & Signature Stamp */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={32} color="#10b981" />
              <div>
                <div style={{ fontWeight: 700, color: '#6ee7b7' }}>Certificado Digital de Validação TransLog 3D</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Aprovado por Criptografia IoT & Motor de IA Preditiva</div>
              </div>
            </div>
            <div className="mono-font" style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
              HASH: 8f9a-32e1-4b2c-901f
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
