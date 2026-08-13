import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CompanySelector from './components/CompanySelector';
import Transport3DViewer from './components/Transport3DViewer';
import ContainerPlan3D from './components/ContainerPlan3D';
import TelemetryDashboard from './components/TelemetryDashboard';
import AIForecastPanel from './components/AIForecastPanel';
import DeliveryReportModal from './components/DeliveryReportModal';

import { COMPANIES_DATA } from './data/companiesData';
import { INITIAL_AI_FEEDBACKS, processAIFeedback } from './data/aiKnowledgeBase';
import { Box, Layers, Cpu, Sparkles } from 'lucide-react';

export default function App() {
  const [companies, setCompanies] = useState(COMPANIES_DATA);
  const [activeCompany, setActiveCompany] = useState(COMPANIES_DATA[0]);
  const [feedbacks, setFeedbacks] = useState(INITIAL_AI_FEEDBACKS);

  // Active view tab (3D Vehicle or 3D Container Plan)
  const [active3DTab, setActive3DTab] = useState('vehicle'); // 'vehicle' | 'container'

  // Telemetry real-time simulation state
  const [isSimulating, setIsSimulating] = useState(true);
  const [telemetryData, setTelemetryData] = useState({
    currentTemp: COMPANIES_DATA[0].currentTemp,
    targetTempMin: COMPANIES_DATA[0].targetTempMin,
    targetTempMax: COMPANIES_DATA[0].targetTempMax,
    humidity: COMPANIES_DATA[0].humidity
  });

  const [showReportModal, setShowReportModal] = useState(false);

  // Synchronize telemetry state when user switches company
  const handleSelectCompany = (comp) => {
    setActiveCompany(comp);
    setTelemetryData({
      currentTemp: comp.currentTemp,
      targetTempMin: comp.targetTempMin,
      targetTempMax: comp.targetTempMax,
      humidity: comp.humidity
    });
  };

  // Real-time telemetry simulation interval
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTelemetryData(prev => {
        // Natural ambient thermal fluctuation (+/- 0.1°C)
        const fluctuation = (Math.random() - 0.49) * 0.2;
        const newTemp = parseFloat((prev.currentTemp + fluctuation).toFixed(1));
        return {
          ...prev,
          currentTemp: newTemp
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Simulate an intentional thermal anomaly (+4°C spike)
  const handleSimulateAnomaly = () => {
    setTelemetryData(prev => ({
      ...prev,
      currentTemp: parseFloat((prev.currentTemp + 4.2).toFixed(1))
    }));
  };

  // Normalize temperature back to target range
  const handleResetTemp = () => {
    const ideal = (activeCompany.targetTempMin + activeCompany.targetTempMax) / 2;
    setTelemetryData(prev => ({
      ...prev,
      currentTemp: parseFloat(ideal.toFixed(1))
    }));
  };

  // Submit Feedback & Retrain AI Engine
  const handleSubmitFeedback = (feedbackInput) => {
    const { updatedCompany, updatedFeedbacks } = processAIFeedback(
      activeCompany,
      feedbackInput,
      feedbacks
    );

    setActiveCompany(updatedCompany);
    setFeedbacks(updatedFeedbacks);

    // Update in companies list
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Sticky Header */}
      <Navbar
        activeCompany={activeCompany}
        onOpenReport={() => setShowReportModal(true)}
        isSimulating={isSimulating}
        toggleSimulation={() => setIsSimulating(!isSimulating)}
      />

      {/* Main Page Content */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* 1. Contracting Companies & 3D Fleet Showcase Selector */}
        <CompanySelector
          companies={companies}
          activeCompany={activeCompany}
          onSelectCompany={handleSelectCompany}
        />

        {/* 2. Interactive 3D Section Switcher (Veículo 3D vs Planta Interna do Contêiner) */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`tab-button ${active3DTab === 'vehicle' ? 'active' : ''}`}
                onClick={() => setActive3DTab('vehicle')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Box size={16} color={active3DTab === 'vehicle' ? '#00f2fe' : undefined} />
                Modelo 3D da Frota ({activeCompany.transportName})
              </button>
              <button
                className={`tab-button ${active3DTab === 'container' ? 'active' : ''}`}
                onClick={() => setActive3DTab('container')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Layers size={16} color={active3DTab === 'container' ? '#00f2fe' : undefined} />
                Planta Virtual 3D Interna do Contêiner
              </button>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#00f2fe" /> Tridimensionalidade Three.js WebGL
            </span>
          </div>

          {/* 3D Render Viewers */}
          {active3DTab === 'vehicle' ? (
            <Transport3DViewer activeCompany={activeCompany} />
          ) : (
            <ContainerPlan3D activeCompany={activeCompany} />
          )}
        </section>

        {/* 3. Real-Time Telemetry Dashboard (Temperature Gauge, GPS, Horários, Status) */}
        <TelemetryDashboard
          activeCompany={activeCompany}
          telemetryData={telemetryData}
          onSimulateAnomaly={handleSimulateAnomaly}
          onResetTemp={handleResetTemp}
          isSimulating={isSimulating}
        />

        {/* 4. AI Forecasting & Preventive Action Plans + Feedback Loop */}
        <AIForecastPanel
          activeCompany={activeCompany}
          feedbacks={feedbacks}
          onSubmitFeedback={handleSubmitFeedback}
        />

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.82rem',
        color: '#64748b',
        background: 'rgba(7, 10, 19, 0.9)'
      }}>
        TransLog 3D © 2026 — Sistema de Rastreio, Telemetria e Inteligência Logística Preditiva
      </footer>

      {/* End-of-Trip Report Modal */}
      {showReportModal && (
        <DeliveryReportModal
          activeCompany={activeCompany}
          telemetryData={telemetryData}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
}
