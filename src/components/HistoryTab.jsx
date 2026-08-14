import React from 'react';
import { BarChart2, DollarSign, Percent, Fuel, Eye, Calendar, MapPin, CheckCircle } from 'lucide-react';

export default function HistoryTab({ trips }) {
  if (!trips || trips.length === 0) {
    return (
      <div className="bg-brand-card rounded-xl p-8 border border-slate-800 text-center max-w-2xl mx-auto my-12 shadow-xl animate-fade-in">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">Nenhuma Viagem no Histórico</h3>
        <p className="text-slate-400 text-sm">
          Simule e finalize uma viagem no painel de **Rastreio Otimizado** para ver os indicadores de custo e eficiência salvos aqui em tempo real.
        </p>
      </div>
    );
  }

  // Calculate global averages/totals
  const totalTrips = trips.length;
  const totalKm = trips.reduce((sum, t) => sum + t.routeDistance, 0);
  const totalValueTransported = trips.reduce((sum, t) => sum + t.productTotalValue, 0);
  const totalFreightPaid = trips.reduce((sum, t) => sum + t.totals.finalTotal, 0);

  // Averages
  const avgCostPerKm = totalKm > 0 
    ? trips.reduce((sum, t) => {
        const costPerKm = t.isAutonomous ? 0 : 1.10; // Custo/km médio
        return sum + (costPerKm * t.routeDistance);
      }, 0) / totalKm
    : 0;

  const avgTransportOverRevenue = totalValueTransported > 0 
    ? (totalFreightPaid / totalValueTransported) * 105 / 100 // small fuel adjustments
    : 0;

  // Let's compute average occupation
  const avgFleetOccupation = trips.reduce((sum, t) => {
    const totalCapacity = t.fleetCapacity || t.totalBreads || 1;
    const occ = (t.totalBreads / totalCapacity) * 100;
    return sum + Math.min(100, occ);
  }, 0) / totalTrips;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Resumo Geral de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Custo por Km */}
        <div className="bg-brand-card border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-brand-secondary transition-all">
          <div className="absolute -right-2 -bottom-2 text-slate-950/5 text-7xl font-bold group-hover:scale-110 transition-transform select-none pointer-events-none z-0">KM</div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-brand-secondary">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider bg-blue-900/30 px-2 py-0.5 rounded">Custo/KM</span>
          </div>
          <h3 className="text-2xl font-bold font-['JetBrains_Mono'] text-white">
            R$ {avgCostPerKm.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-450 mt-2">Custo por KM rodado (Combustível, manutenção, pneus e depreciação)</p>
        </div>

        {/* KPI 2: Frete sobre Faturamento */}
        <div className="bg-brand-card border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute -right-2 -bottom-2 text-slate-950/5 text-7xl font-bold group-hover:scale-110 transition-transform select-none pointer-events-none z-0">%</div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Percent size={24} />
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-900/30 px-2 py-0.5 rounded">Frete/Faturamento</span>
          </div>
          <h3 className="text-2xl font-bold font-['JetBrains_Mono'] text-white">
            {avgTransportOverRevenue.toFixed(1)}%
          </h3>
          <p className="text-xs text-slate-450 mt-2">Percentual do faturamento da empresa consumido pelas operações de frete</p>
        </div>

        {/* KPI 3: Consumo Médio de Combustível */}
        <div className="bg-brand-card border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-brand-primary transition-all">
          <div className="absolute -right-2 -bottom-2 text-slate-950/5 text-7xl font-bold group-hover:scale-110 transition-transform select-none pointer-events-none z-0 font-sans">L/km</div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-brand-primary">
              <Fuel size={24} />
            </div>
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider bg-amber-900/30 px-2 py-0.5 rounded">Consumo Médio</span>
          </div>
          <h3 className="text-2xl font-bold font-['JetBrains_Mono'] text-white">
            {trips[0]?.isAutonomous ? 'N/A (Próprio)' : trips[0]?.fleetCart?.vuc ? '7.8 km/L' : trips[0]?.fleetCart?.hr ? '9.2 km/L' : '12.5 km/L'}
          </h3>
          <p className="text-xs text-slate-450 mt-2">Eficiência energética ou consumo médio de combustível da frota</p>
        </div>

        {/* KPI 4: Taxa de Ocupação da Frota */}
        <div className="bg-brand-card border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-purple-500 transition-all">
          <div className="absolute -right-2 -bottom-2 text-slate-950/5 text-7xl font-bold group-hover:scale-110 transition-transform select-none pointer-events-none z-0">Cap</div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <BarChart2 size={24} />
            </div>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-900/30 px-2 py-0.5 rounded">Taxa Ocupação</span>
          </div>
          <h3 className="text-2xl font-bold font-['JetBrains_Mono'] text-white">
            {avgFleetOccupation.toFixed(1)}%
          </h3>
          <p className="text-xs text-slate-450 mt-2">Relação entre a capacidade máxima do veículo e o volume transportado</p>
        </div>

      </div>

      {/* Tabela de Histórico de Viagens */}
      <div className="bg-brand-card rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            📂 Histórico de Viagens Realizadas e Salvas
          </h3>
          <span className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-400 font-mono">
            {totalTrips} registro(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-450 text-xs uppercase font-semibold">
                <th className="p-4">Viagem ID</th>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Modalidade de Frete</th>
                <th className="p-4">Distância</th>
                <th className="p-4">Ocupação</th>
                <th className="p-4">Custo Total</th>
                <th className="p-4">Faturamento Carga</th>
                <th className="p-4">Custo/Faturamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-sm text-slate-300">
              {trips.map((trip, idx) => {
                const occupancy = trip.fleetCapacity > 0 ? (trip.totalBreads / trip.fleetCapacity) * 100 : 100;
                const ratio = trip.productTotalValue > 0 ? (trip.totals.finalTotal / trip.productTotalValue) * 100 : 0;

                return (
                  <tr key={trip.id + '-' + idx} className="hover:bg-slate-800/30 transition-colors">
                    {/* ID */}
                    <td className="p-4 font-bold font-['JetBrains_Mono'] text-brand-secondary">
                      {trip.id}
                    </td>
                    {/* Data */}
                    <td className="p-4 text-xs font-mono text-slate-400">
                      {trip.date}
                    </td>
                    {/* Plano */}
                    <td className="p-4">
                      {trip.isAutonomous ? (
                        <span className="text-[11px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Transporte Autônomo</span>
                      ) : (
                        <span className="text-[11px] font-bold bg-blue-500/10 text-brand-secondary px-2 py-0.5 rounded border border-blue-500/20">
                          {trip.selectedPlan === 'none' ? 'Terceirizado Padrão' : `Plano ${trip.selectedPlan.toUpperCase()}`}
                        </span>
                      )}
                    </td>
                    {/* KM */}
                    <td className="p-4 font-mono">
                      {trip.routeDistance} km
                    </td>
                    {/* Ocupação */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs w-10">{occupancy.toFixed(0)}%</span>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${occupancy >= 100 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, occupancy)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    {/* Custo Total */}
                    <td className="p-4 font-bold text-emerald-400 font-mono">
                      R$ {trip.totals.finalTotal.toFixed(2)}
                    </td>
                    {/* Faturamento */}
                    <td className="p-4 font-mono text-slate-400">
                      R$ {trip.productTotalValue.toFixed(2)}
                    </td>
                    {/* Ratio */}
                    <td className="p-4 font-mono text-xs text-brand-secondary">
                      {ratio.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
