import React from 'react';
import { Star, Truck, Ship, Plane, Navigation, ArrowRight } from 'lucide-react';

export default function CompanySelector({ companies, activeCompany, onSelectCompany }) {
  const getTransportIcon = (type) => {
    switch (type) {
      case 'truck': return <Truck size={20} />;
      case 'ship': return <Ship size={20} />;
      case 'plane': return <Plane size={20} />;
      case 'train': return <Navigation size={20} />;
      default: return <Truck size={20} />;
    }
  };

  return (
    <section style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏢</span> Empresas Contratantes & Catalogo de Frotas 3D
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Selecione uma empresa para carregar o modelo 3D do veículo cadastrado e a telemetria correspondente.
          </p>
        </div>
        <span className="badge badge-cyan">4 Empresas Disponíveis</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {companies.map((comp) => {
          const isSelected = comp.id === activeCompany.id;
          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompany(comp)}
              className={`glass-panel ${isSelected ? 'glass-panel-cyan' : ''}`}
              style={{
                padding: '16px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: isSelected ? 'rgba(0, 242, 254, 0.06)' : undefined,
                borderColor: isSelected ? comp.color : undefined
              }}
            >
              {/* Highlight bar if selected */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: comp.color,
                  boxShadow: `0 0 10px ${comp.color}`
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{comp.logo}</span>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>
                      {comp.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{comp.badge}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#f59e0b' }}>
                  <Star size={14} fill="#f59e0b" />
                  <strong>{comp.rating}</strong>
                </div>
              </div>

              {/* Transport Specs */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '10px',
                padding: '10px 12px',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ color: comp.color }}>
                  {getTransportIcon(comp.transportType)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {comp.transportName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {comp.cargoName}
                  </div>
                </div>
              </div>

              {/* Footer specs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                <span>Faixa: <strong style={{ color: comp.color }}>{comp.targetTempMin}°C a {comp.targetTempMax}°C</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isSelected ? comp.color : '#94a3b8', fontWeight: isSelected ? 700 : 400 }}>
                  {isSelected ? 'Modelo 3D Ativo' : 'Carregar 3D'} <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
