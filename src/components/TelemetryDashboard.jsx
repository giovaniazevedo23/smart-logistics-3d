import React, { useEffect, useState } from 'react';
import { Thermometer, Clock, Navigation, AlertTriangle, ShieldCheck, Activity, Battery, Flame, RefreshCw } from 'lucide-react';

export default function TelemetryDashboard({
  activeCompany,
  telemetryData,
  onSimulateAnomaly,
  onResetTemp,
  isSimulating
}) {
  const { currentTemp, targetTempMin, targetTempMax, humidity } = telemetryData;
  const isOutOfRange = currentTemp < targetTempMin || currentTemp > targetTempMax;

  // Temperature chart history (last 10 readings)
  const [tempHistory, setTempHistory] = useState([
    currentTemp - 0.4,
    currentTemp - 0.2,
    currentTemp - 0.1,
    currentTemp + 0.1,
    currentTemp
  ]);

  useEffect(() => {
    setTempHistory(prev => [...prev.slice(-9), currentTemp]);
  }, [currentTemp]);

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '24px' }}>
      
      {/* 1. MONITOR TÉRMICO EM TEMPO REAL */}
      <div className={`glass-panel ${isOutOfRange ? 'glass-panel-danger' : ''}`} style={{
        padding: '20px',
        borderColor: isOutOfRange ? '#ef4444' : undefined,
        boxShadow: isOutOfRange ? '0 0 25px rgba(239, 68, 68, 0.3)' : undefined
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isOutOfRange ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isOutOfRange ? '#ef4444' : '#00f2fe'
            }}>
              <Thermometer size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Monitor de Temperatura IoT
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Sensores NTC Duplos em Tempo Real
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-outline" onClick={onSimulateAnomaly} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <Flame size={14} color="#f59e0b" /> Simular Flutuação (+4°C)
            </button>
            {isOutOfRange && (
              <button className="btn btn-success" onClick={onResetTemp} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                <RefreshCw size={14} /> Normalizar
              </button>
            )}
          </div>
        </div>

        {/* Current Temp Display & Range Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px', alignItems: 'center', margin: '14px 0' }}>
          {/* Temperature Big Counter */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '16px 22px',
            borderRadius: '16px',
            border: `1px solid ${isOutOfRange ? '#ef4444' : 'rgba(0, 242, 254, 0.2)'}`,
            textAlign: 'center'
          }}>
            <div className="mono-font" style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              color: isOutOfRange ? '#ef4444' : activeCompany.color,
              lineHeight: 1
            }}>
              {currentTemp.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: isOutOfRange ? '#fca5a5' : '#94a3b8', fontWeight: 600 }}>
              {isOutOfRange ? '⚠️ ALERTA DE DESVIO TÉRMICO' : 'STATUS TÉRMICO ESTÁVEL'}
            </div>
          </div>

          {/* Range Spec & Mini Sparkline Graph */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              <span>Faixa Segura Alvo:</span>
              <strong style={{ color: '#00f2fe' }}>{targetTempMin}°C a {targetTempMax}°C</strong>
            </div>

            {/* Visual Thermal Range Progress Bar */}
            <div style={{
              height: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '14px'
            }}>
              <div style={{
                position: 'absolute',
                left: '20%',
                width: '60%',
                height: '100%',
                background: 'rgba(16, 185, 129, 0.3)',
                borderLeft: '2px solid #10b981',
                borderRight: '2px solid #10b981'
              }} />
              {/* Current Temp Indicator Dot */}
              <div style={{
                position: 'absolute',
                left: `${Math.min(95, Math.max(5, 50 + (currentTemp - ((targetTempMin + targetTempMax) / 2)) * 8))}%`,
                top: '-3px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: isOutOfRange ? '#ef4444' : '#00f2fe',
                boxShadow: `0 0 10px ${isOutOfRange ? '#ef4444' : '#00f2fe'}`,
                transform: 'translateX(-50%)'
              }} />
            </div>

            {/* Sparkline Graph */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '36px' }}>
              {tempHistory.map((val, idx) => {
                const normHeight = Math.min(100, Math.max(15, 50 + (val - ((targetTempMin + targetTempMax) / 2)) * 12));
                const isErr = val < targetTempMin || val > targetTempMax;
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${normHeight}%`,
                      background: isErr ? '#ef4444' : activeCompany.color,
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                    title={`Leitura #${idx + 1}: ${val.toFixed(1)}°C`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Extra Sensor Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Umidade Relativa:</span>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>{humidity}% HR</div>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Bateria do Sensor:</span>
            <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Battery size={14} /> 98% (Ok)
            </div>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Frequência IoT:</span>
            <div style={{ fontWeight: 700, color: '#00f2fe', fontSize: '0.9rem' }}>Cada 5s</div>
          </div>
        </div>
      </div>

      {/* 2. HORÁRIO & RASTREIO DO PRODUTO (GPS MAP & ETA) */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6'
            }}>
              <Navigation size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Rastreio & Horários de Percurso
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                GPS Telemetria ao Vivo
              </span>
            </div>
          </div>
          <span className="badge badge-purple">{activeCompany.status}</span>
        </div>

        {/* Route Details */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', padding: '14px', margin: '8px 0', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Origem:</div>
              <strong style={{ color: '#f8fafc' }}>{activeCompany.origin}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Destino:</div>
              <strong style={{ color: '#00f2fe' }}>{activeCompany.destination}</strong>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div style={{ margin: '12px 0 6px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              <span>Progresso do Percurso: <strong>{activeCompany.progress}%</strong></span>
              <span>Distância Total: <strong>{activeCompany.routeDistance}</strong></span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${activeCompany.progress}%`,
                background: 'linear-gradient(90deg, #00f2fe 0%, #8b5cf6 100%)',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Timings & Speed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="#00f2fe" /> Tempo Decorrido:
            </div>
            <strong className="mono-font" style={{ fontSize: '1.05rem', color: '#f8fafc', display: 'block', marginTop: '2px' }}>
              {activeCompany.elapsedTime}
            </strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="#8b5cf6" /> Previsão de Chegada (ETA):
            </div>
            <strong className="mono-font" style={{ fontSize: '1.05rem', color: '#8b5cf6', display: 'block', marginTop: '2px' }}>
              {activeCompany.eta}
            </strong>
          </div>
        </div>
      </div>

    </section>
  );
}
