export const DELIVERY_NODES = [
  { id: 'cd', name: 'CD (Fábrica Central)', type: 'cd', status: 'completed', quantity: 1694 },
  { id: 'filial1', name: 'Filial 1 (309 un)', type: 'branch', status: 'pending', quantity: 309 },
  { id: 'filial3', name: 'Filial 3 (410 un)', type: 'branch', status: 'pending', quantity: 410 },
  { id: 'filial2', name: 'Filial 2 (460 un)', type: 'branch', status: 'pending', quantity: 460 },
  { id: 'filial4', name: 'Filial 4 (515 un)', type: 'branch', status: 'pending', quantity: 515 }
];

export const FLEET_VEHICLES = [
  {
    id: 'fiorino-eutetica',
    name: 'Fiorino Isotérmica',
    type: 'Utilitário Leve (Placas Eutéticas)',
    capacity: '85kg (Pão Congelado)',
    icon: '❄️🚐',
    color: '#00f2fe'
  },
  {
    id: 'doblo',
    name: 'Doblo Cargo Térmica',
    type: 'Utilitário Leve',
    capacity: '60kg',
    icon: '🚙',
    color: '#38bdf8'
  },
  {
    id: 'vuc',
    name: 'VUC (Baú Térmico)',
    type: 'Veículo Urbano de Carga',
    capacity: '150 Caixas Plásticas',
    icon: '🚚',
    color: '#10b981'
  }
];

export const CURRENT_TRIP = {
  id: 'SAGA-SENAI-8821',
  vehicleId: 'fiorino-eutetica',
  driver: 'João Silva',
  departureTime: '04:30 AM',
  totalBoxes: 1694,
  cargo: 'Pão Francês Congelado (Massa Crua)',
  targetTemp: { min: -18, max: -12 }, 
  maxTransitTimeMins: 45
};
