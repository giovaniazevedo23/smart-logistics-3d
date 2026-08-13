import React, { useEffect, useRef } from 'react';

const WAYPOINTS = [
  { name: 'CD Polo Industrial', lat: -5.1325, lng: -42.7936 },
  { name: 'Filial 1', lat: -5.0890, lng: -42.8120 },
  { name: 'Filial 3', lat: -5.0680, lng: -42.7850 },
  { name: 'Filial 2', lat: -5.0350, lng: -42.8150 },
  { name: 'Filial 4', lat: -5.1100, lng: -42.7500 },
];

export default function LiveMapRoute({ currentNodeIndex, stepStatus }) {
  const [isMapLoaded, setIsMapLoaded] = React.useState(!!window.L);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!window.L) {
      const interval = setInterval(() => {
        if (window.L) {
          setIsMapLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Initialize map only once
    if (isMapLoaded && !mapInstance.current && mapRef.current) {
      const L = window.L;
      
      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([-5.0892, -42.8016], 12);
      
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add dark-themed OpenStreetMap tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Draw polyline route
      const latlngs = WAYPOINTS.map(wp => [wp.lat, wp.lng]);
      const polyline = L.polyline(latlngs, { color: '#38bdf8', weight: 4, opacity: 0.8, dashArray: '10, 10' }).addTo(map);
      
      // Fit bounds to show whole route
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

      // Add nodes as circle markers
      WAYPOINTS.forEach((wp, idx) => {
        const isCD = idx === 0;
        L.circleMarker([wp.lat, wp.lng], {
          radius: isCD ? 8 : 6,
          fillColor: isCD ? '#f59e0b' : '#10b981',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map).bindPopup(`<b>${wp.name}</b>`);
      });

      // Add truck marker
      const truckIcon = L.divIcon({
        className: 'custom-truck-icon',
        html: `<div style="background-color: #38bdf8; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(56,189,248, 0.8);">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      markerRef.current = L.marker([WAYPOINTS[0].lat, WAYPOINTS[0].lng], { icon: truckIcon }).addTo(map);

      mapInstance.current = map;
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMapLoaded]);

  useEffect(() => {
    if (!markerRef.current) return;
    
    // Logic to move marker based on state
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const currentWP = WAYPOINTS[currentNodeIndex];
    const nextWP = WAYPOINTS[currentNodeIndex + 1];

    if (stepStatus === 'transit' && nextWP) {
      // Animate between currentWP and nextWP over 15 seconds
      const duration = 15000; 
      const start = performance.now();
      
      const animate = (time) => {
        let elapsed = time - start;
        let progress = Math.min(elapsed / duration, 1);
        
        // Linear interpolation
        const lat = currentWP.lat + (nextWP.lat - currentWP.lat) * progress;
        const lng = currentWP.lng + (nextWP.lng - currentWP.lng) * progress;
        
        markerRef.current.setLatLng([lat, lng]);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Snap to current node if waiting, loading, or unloading
      markerRef.current.setLatLng([currentWP.lat, currentWP.lng]);
    }
  }, [currentNodeIndex, stepStatus]);

  return (
    <div className="bg-brand-card rounded-xl border border-slate-800 shadow-xl overflow-hidden mb-6 flex flex-col h-80 relative animate-fade-in z-0">
      <div className="absolute top-4 left-4 z-[400] bg-brand-dark/90 px-4 py-2 rounded-lg border border-slate-700 backdrop-blur-sm pointer-events-none">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
           GPS Tracking Ativo
           <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </h3>
        <p className="text-slate-400 text-xs mt-1">Rota Otimizada: Teresina - PI</p>
      </div>
      
      {!isMapLoaded ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
           Carregando Módulo de Mapas (Leaflet)...
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full z-0"></div>
      )}
    </div>
  );
}
