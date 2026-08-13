export const COMPANIES_DATA = [
  {
    id: 'frigorifico-silva',
    name: 'Frigorífico Silva — BestBeef',
    badge: 'Carreta Frigorífica & Carnes Nores Premium',
    logo: '🥩',
    color: '#f59e0b',
    rating: 5.0,
    tripsCompleted: 3450,
    transportType: 'truck',
    transportName: 'Carreta Frigorífica BestBeef (Frigorífico Silva)',
    modelSpec: 'Scania R540 6x4 + Baú Frigorífico Tri-Dem Cryovac / ThermoKing',
    capacity: '28 Toneladas / 28 Paletes de Carnes Resfriadas',
    cargoName: 'Cortes Bovinos Nobres BestBeef (Embalados a Vácuo Cryovac)',
    cargoSku: 'BEEF-SILVA-2026',
    targetTempMin: -2.0,
    targetTempMax: 2.0,
    currentTemp: 0.4,
    humidity: 85,
    origin: 'Santa Maria, RS (Matriz Frigorífico Silva)',
    destination: 'São Paulo, SP (Hub Logístico Distribuição)',
    routeDistance: '1.180 km',
    elapsedTime: '11:30:00',
    eta: '02:45:00',
    progress: 81,
    speed: 82,
    status: 'Em Trânsito - Cadeia de Frio Ideal',
    details: {
      description: 'Carreta frigorífica de alta performance para transporte de carnes nobres embaladas a vácuo, garantindo manutenção rigorosa de temperatura.',
      useCases: ['Transporte de carnes premium (Angus, Wagyu)', 'Logística de cortes resfriados para redes de restaurantes', 'Exportação inter-estadual de perecíveis de alto valor'],
      specifications: ['Cavalo Mecânico: Scania R540 6x4', 'Carroceria: Baú Frigorífico Tri-Dem Cryovac', 'Refrigeração: ThermoKing de alta precisão']
    },
    containerLayout: {
      totalPallets: 28,
      zones: [
        { name: 'Zona Dianteira (ThermoKing Evaporador)', item: 'Cortes Especiais BestBeef (Picanha, Ancho, Chorizo)', pallets: 10, temp: -0.5, status: 'Ideal' },
        { name: 'Zona Central (Coração do Baú)', item: 'Linha BestBeef Black & Angus Hambúrgueres', pallets: 10, temp: 0.2, status: 'Ideal' },
        { name: 'Zona Traseira (Portas de Expalação)', item: 'Linha Cryovac Embalados a Vácuo Resfriados', pallets: 8, temp: 0.8, status: 'Monitorar' }
      ]
    },
    aiForecast: {
      riskScore: '4%',
      riskLevel: 'Mínimo',
      insights: [
        'Temperatura interna do Baú Frigorífico mantida em +0.4°C constantes (Margem ideal para cortes resfriados).',
        'Vedações de borracha e isolamento em poliuretano expandido Cryovac operando com eficácia máxima de 99.8%.'
      ],
      preventivePlans: [
        'Manter refrigeração ativa em modo contínuo até a doca de desembarque em São Paulo.',
        'Realizar verificação de rotina do nível do tanque de combustível do motor auxiliar ThermoKing.'
      ]
    }
  },
  {
    id: 'coldchain-express',
    name: 'ColdChain Express Solutions',
    badge: 'Cadeia de Frio Farmacêutica & Alimentar',
    logo: '❄️',
    color: '#00f2fe',
    rating: 4.9,
    tripsCompleted: 1420,
    transportType: 'truck',
    transportName: 'Caminhão Frigorífico Volvo FH 540',
    modelSpec: 'ThermoKing Sentinel Ultra - Baú Tripla Isolamento',
    capacity: '28 Toneladas / 30 Paletes',
    cargoName: 'Vacinas RNAm & Insulina de Alta Pureza',
    cargoSku: 'VAC-2026-NEXUS',
    targetTempMin: -22.0,
    targetTempMax: -18.0,
    currentTemp: -19.8,
    humidity: 45,
    origin: 'São Paulo, SP (Hub BioTech)',
    destination: 'Curitiba, PR (Centro de Distribuição Sul)',
    routeDistance: '408 km',
    elapsedTime: '03:45:00',
    eta: '01:15:00',
    progress: 75,
    speed: 78,
    status: 'Em Trânsito - Seguro',
    details: {
      description: 'Veículo com triplo isolamento térmico especializado em logística farmacêutica de altíssima exigência, como vacinas e medicamentos termolábeis.',
      useCases: ['Transporte de Vacinas RNAm e insumos biológicos', 'Distribuição de insulina e medicamentos de alto custo', 'Logística hospitalar de urgência'],
      specifications: ['Cavalo Mecânico: Volvo FH 540', 'Carroceria: Baú de Triplo Isolamento', 'Refrigeração: ThermoKing Sentinel Ultra com redundância']
    },
    containerLayout: {
      totalPallets: 12,
      zones: [
        { name: 'Zona Dianteira (Evaporador)', item: 'Lote 01: Insulina Humana Recombinante', pallets: 4, temp: -20.2, status: 'Ideal' },
        { name: 'Zona Central (Coração do Baú)', item: 'Lote 02: Vacinas RNAm Ultracongeladas', pallets: 4, temp: -19.8, status: 'Ideal' },
        { name: 'Zona Traseira (Portas de Carga)', item: 'Lote 03: Kits de Reagentes de Laboratório', pallets: 4, temp: -18.9, status: 'Monitorar' }
      ]
    },
    aiForecast: {
      riskScore: '12%',
      riskLevel: 'Baixo Risco',
      insights: [
        'Pressão do compressor ThermoKing mantida com estabilidade de 99.4%.',
        'Variação térmica acumulada ao abrir porta em parada prévia: +0.6°C (compensada em 4 min).'
      ],
      preventivePlans: [
        'Manter ciclos de refrigeração no modo contínuo até a entrega em Curitiba.',
        'Realizar calibração preventiva do sensor NTC 03 antes do percurso de retorno.'
      ]
    }
  },
  {
    id: 'oceanic-intermodal',
    name: 'Oceanic Intermodal Global',
    badge: 'Transporte Marítimo Transoceânico',
    logo: '⚓',
    color: '#3b82f6',
    rating: 4.8,
    tripsCompleted: 890,
    transportType: 'ship',
    transportName: 'Navio Porta-Contêineres Everest Sentinel',
    modelSpec: 'Neopanamax 14.000 TEU com Tomadas Reefer Inteligentes',
    capacity: '14.000 TEU / 85.000 Toneladas',
    cargoName: 'Frutas Frescas & Cargas Frigorificadas Premium',
    cargoSku: 'FRU-EXP-OCEAN-88',
    targetTempMin: 2.0,
    targetTempMax: 4.0,
    currentTemp: 3.1,
    humidity: 85,
    origin: 'Porto de Santos, SP',
    destination: 'Porto de Roterdã, Holanda',
    routeDistance: '9.820 MN',
    elapsedTime: '12 Dias, 08 Horas',
    eta: '03 Dias, 14 Horas',
    progress: 78,
    speed: 22, // nós
    status: 'Navegação em Alto Mar - Estável',
    details: {
      description: 'Navio porta-contêineres de classe Post-Panamax projetado para rotas intercontinentais com alta eficiência energética e capacidade para contêineres reefer.',
      useCases: ['Exportação de commodities em larga escala', 'Transporte internacional de contêineres refrigerados (Reefer)', 'Rotas transoceânicas de longa duração'],
      specifications: ['Classe: Post-Panamax', 'Capacidade: 4500 TEUs', 'Motorização: Diesel-Elétrico de alta eficiência']
    },
    containerLayout: {
      totalPallets: 24,
      zones: [
        { name: 'Bordo Bombordo', item: 'Contêiner R-102: Uvas e Mangas Exportação', pallets: 8, temp: 3.0, status: 'Excelente' },
        { name: 'Centro de Porão', item: 'Contêiner R-104: Carnes In Natura Resfriadas', pallets: 8, temp: 2.8, status: 'Excelente' },
        { name: 'Bordo Estibordo', item: 'Contêiner R-109: Polpas de Frutas Tropicais', pallets: 8, temp: 3.4, status: 'Estável' }
      ]
    },
    aiForecast: {
      riskScore: '24%',
      riskLevel: 'Risco Moderado',
      insights: [
        'Frente fria com ondas de 3.5m detectada no Atlântico Norte (Sem impacto no sistema de refrigeração).',
        'Sensores IoT de umidade relativa indicam estabilidade em 85%.'
      ],
      preventivePlans: [
        'Reforçar peação dos contêineres do convés superior devido à ondulação.',
        'Ativar rotina de desgaseificação de etileno nas últimas 48 horas de navegação.'
      ]
    }
  },
  {
    id: 'aerocargo-express',
    name: 'AeroCargo Express International',
    badge: 'Frete Aéreo Crítico de Alta Velocidade',
    logo: '✈️',
    color: '#8b5cf6',
    rating: 5.0,
    tripsCompleted: 2150,
    transportType: 'plane',
    transportName: 'Boeing 777F Freighter Ultra Cargo',
    modelSpec: 'Compartimento Inferior Climatizado Activo Environtainer',
    capacity: '102 Toneladas Pague-Junto',
    cargoName: 'Equipamentos Médicos de Precisão & Soro Especial',
    cargoSku: 'AERO-MED-990X',
    targetTempMin: 15.0,
    targetTempMax: 22.0,
    currentTemp: 18.5,
    humidity: 40,
    origin: 'Aeroporto Viracopos, Campinas (VCP)',
    destination: 'Aeroporto Frankfurt, Alemanha (FRA)',
    routeDistance: '9.500 km',
    elapsedTime: '07h 40m',
    eta: '02h 10m',
    progress: 82,
    speed: 880, // km/h
    status: 'Aproximação Final - No Horário',
    details: {
      description: 'Aeronave cargueira de longo alcance otimizada para fretes expressos intercontinentais e cargas perecíveis ou de alto valor agregado.',
      useCases: ['Frete expresso internacional de eletrônicos', 'Transporte de perecíveis de curtíssima validade (flores, frutos do mar)', 'Envio de componentes automotivos e aeroespaciais críticos'],
      specifications: ['Aeronave: Boeing 777F Freighter', 'Capacidade: 102 Toneladas', 'Velocidade de Cruzeiro: 905 km/h (Mach 0.84)']
    },
    containerLayout: {
      totalPallets: 8,
      zones: [
        { name: 'Palete Aéreo ULD 01', item: 'Scanners de Ressonância Magnética', pallets: 3, temp: 18.2, status: 'Perfeito' },
        { name: 'Palete Aéreo ULD 02', item: 'Componentes Ópticos Laser de Hospital', pallets: 3, temp: 18.5, status: 'Perfeito' },
        { name: 'Palete Aéreo ULD 03', item: 'Kits Biológicos em Palete Ativo RKN', pallets: 2, temp: 17.8, status: 'Perfeito' }
      ]
    },
    aiForecast: {
      riskScore: '5%',
      riskLevel: 'Mínimo',
      insights: [
        'Pressão de cabine mantida em 8.000 ft equivalente com variação de temperatura < 0.2°C.',
        'Zero turbulência severa reportada na rota aérea transatlântica.'
      ],
      preventivePlans: [
        'Prioridade de descarga rápida e transferência direta para câmara fria no Hangar 4 de Frankfurt.'
      ]
    }
  },
  {
    id: 'transrail-heavy',
    name: 'TransRail Heavy Freight',
    badge: 'Ferrovia e Cargas Pesadas de Volume',
    logo: '🚂',
    color: '#10b981',
    rating: 4.7,
    tripsCompleted: 610,
    transportType: 'train',
    transportName: 'Locomotiva Eletrodiesel GE Evolution Series',
    modelSpec: '80 Vagões Fechados Tipo Boxcar Climatizados',
    capacity: '6.400 Toneladas',
    cargoName: 'Grãos Especiais & Insumos Agrícolas Processados',
    cargoSku: 'RAIL-GRAIN-773',
    targetTempMin: 18.0,
    targetTempMax: 26.0,
    currentTemp: 22.4,
    humidity: 55,
    origin: 'Rondonópolis, MT',
    destination: 'Porto de Paranaguá, PR',
    routeDistance: '1.450 km',
    elapsedTime: '28 Horas',
    eta: '06 Horas',
    progress: 82,
    speed: 55, // km/h
    status: 'Em Trânsito Ferroviário',
    details: {
      description: 'Sistema de transporte ferroviário de alta capacidade, equipado com vagões climatizados para preservação de grãos e insumos agrícolas sensíveis à umidade e temperatura.',
      useCases: ['Logística de exportação de soja e milho', 'Transporte de insumos agrícolas a granel', 'Distribuição multimodal entre regiões produtoras e portos'],
      specifications: ['Locomotiva: GE Evolution Series', 'Capacidade: 80 vagões fechados', 'Sistema: Monitoramento remoto de carga via rede ferroviária']
    },
    containerLayout: {
      totalPallets: 40,
      zones: [
        { name: 'Vagão 01 a 20', item: 'Soja em Grãos Selecionados para Exportação', pallets: 20, temp: 22.1, status: 'Normal' },
        { name: 'Vagão 21 a 40', item: 'Farelo Enriquecido Climatizado em BigBags', pallets: 20, temp: 22.7, status: 'Normal' }
      ]
    },
    aiForecast: {
      riskScore: '18%',
      riskLevel: 'Baixo Risco',
      insights: [
        'Vibração de trilho mantida dentro das especificações de amortecimento pneumático.',
        'Sensoriamento de umidade nos vagões sem indícios de infiltração.'
      ],
      preventivePlans: [
        'Vistoria nos engates pneumáticos no Pátio de Manobra de Bauru.'
      ]
    }
  }
];
