import React from 'react';
import { ShieldCheck, Truck, Cpu, FileText, Activity } from 'lucide-react';

export default function Navbar({ activeCompany, onOpenReport, isSimulating, toggleSimulation }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 28px',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#030712',
          boxShadow: '0 0 18px rgba(0, 242, 254, 0.4)'
        }}>
          <Truck size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
            TransLog <span style={{ color: '#00f2fe' }}>3D</span>
          </h1>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={12} color="#00f2fe" /> Plataforma de Cargas & Telemetria IA
          </span>
        </div>
      </div>

      {/* Center Status Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '8px 18px',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <span className="pulse-dot" style={{ color: activeCompany.color }}></span>
          <span style={{ color: '#94a3b8' }}>Empresa Ativa:</span>
          <strong style={{ color: '#f8fafc' }}>{activeCompany.name}</strong>
        </div>
        <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ color: '#6ee7b7', fontWeight: 600 }}>IoT Conectado</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className={`btn ${isSimulating ? 'btn-danger' : 'btn-success'}`}
          onClick={toggleSimulation}
          title={isSimulating ? 'Pausar Simulação em Tempo Real' : 'Iniciar Simulação em Tempo Real'}
          style={{ fontSize: '0.85rem' }}
        >
          <Activity size={16} />
          {isSimulating ? 'Pausar Telemetria' : 'Simular Telemetria'}
        </button>

        <button className="btn btn-primary" onClick={onOpenReport}>
          <FileText size={16} />
          Relatório de Entrega
        </button>
      </div>
    </header>
  );
}
