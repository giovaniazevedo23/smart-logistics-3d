export const DELIVERY_NODES = [
  { id: 'cd', name: 'Centro de Distribuição (Forno)', type: 'cd', status: 'completed' },
  { id: 'filial1', name: 'Filial 1 (Centro)', type: 'branch', status: 'pending' },
  { id: 'filial2', name: 'Filial 2 (Zona Sul)', type: 'branch', status: 'pending' },
  { id: 'filial3', name: 'Filial 3 (Zona Norte)', type: 'branch', status: 'pending' },
  { id: 'filial4', name: 'Filial 4 (Shopping)', type: 'branch', status: 'pending' }
];

export const FLEET_VEHICLES = [
  {
    id: 'fiorino',
    name: 'Fiorino Furgão',
    type: 'Utilitário Leve',
    capacity: '80 Caixas Plásticas',
    icon: '🚐',
    color: '#f59e0b'
  },
  {
    id: 'doblo',
    name: 'Doblo Cargo',
    type: 'Utilitário Leve',
    capacity: '60 Caixas Plásticas',
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
  id: 'TRIP-9921',
  vehicleId: 'fiorino',
  driver: 'João Silva',
  departureTime: '04:30 AM',
  totalBoxes: 80,
  cargo: 'Pão Francês, Croissants e Pão de Queijo',
  targetTemp: { min: 18, max: 25 }, // Ideal temp to keep crispness
  maxTransitTimeMins: 45 // Max time between branches to avoid getting stale
};
