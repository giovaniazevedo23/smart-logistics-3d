import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Thermometer, ShieldAlert, CheckCircle2, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function ContainerPlan3D({ activeCompany }) {
  const mountRef = useRef(null);
  const [selectedPallet, setSelectedPallet] = useState(null);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cutaway'); // 'cutaway' or 'top'

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const palletsGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);

  const containerLayout = activeCompany.containerLayout;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b15);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    if (viewMode === 'top') {
      camera.position.set(0, 14, 0.1);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(9, 7, 10);
      camera.lookAt(0, 1, 0);
    }
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 2, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 5. Container Shell / Outer Frame (Semi-transparent Cutaway)
    const contWidth = 10;
    const contHeight = 3;
    const contDepth = 4;

    // Floor
    const floorGeo = new THREE.BoxGeometry(contWidth, 0.2, contDepth);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    scene.add(floor);

    // Floor Grid lines
    const grid = new THREE.GridHelper(10, 10, 0x00f2fe, 0x334155);
    grid.position.y = 0.01;
    scene.add(grid);

    // Cutaway Back Wall
    const backWallGeo = new THREE.BoxGeometry(contWidth, contHeight, 0.1);
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, transparent: true, opacity: 0.85 });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, contHeight / 2, -contDepth / 2);
    scene.add(backWall);

    // Wireframe Outer Bounding Box
    const wireGeo = new THREE.BoxGeometry(contWidth, contHeight, contDepth);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.25 });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    wireframe.position.y = contHeight / 2;
    scene.add(wireframe);

    // 6. Pallets & Cargo Items Group
    const palletsGroup = new THREE.Group();
    scene.add(palletsGroup);
    palletsGroupRef.current = palletsGroup;

    // Generate 3D Pallets inside container
    const palletMeshes = [];
    const zones = containerLayout.zones;
    let palletIdCounter = 1;

    // Coordinates mapping for zones
    const xOffsets = [-3.2, 0, 3.2]; // Dianteira, Central, Traseira

    zones.forEach((zone, zIdx) => {
      const xBase = xOffsets[zIdx];
      const zoneName = zone.name;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const x = xBase + (col - 0.5) * 1.4;
          const z = (row - 0.5) * 1.6;
          const pid = palletIdCounter++;

          // Wooden Pallet Base
          const palGeo = new THREE.BoxGeometry(1.2, 0.15, 1.3);
          const palMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
          const palMesh = new THREE.Mesh(palGeo, palMat);
          palMesh.position.set(x, 0.08, z);
          palletsGroup.add(palMesh);

          // Cargo Stack Box
          const boxHeight = 1.6 + Math.random() * 0.4;
          const boxGeo = new THREE.BoxGeometry(1.15, boxHeight, 1.25);
          
          let boxColor = 0x00f2fe; // cyan default
          if (zone.status === 'Monitorar') boxColor = 0xf59e0b; // amber
          if (zone.status === 'Crítico') boxColor = 0xef4444; // red

          const boxMat = new THREE.MeshStandardMaterial({
            color: boxColor,
            roughness: 0.3,
            metalness: 0.2,
            transparent: true,
            opacity: 0.9
          });

          const boxMesh = new THREE.Mesh(boxGeo, boxMat);
          boxMesh.position.set(x, boxHeight / 2 + 0.15, z);
          boxMesh.userData = {
            id: pid,
            zone: zoneName,
            item: zone.item,
            temp: zone.temp,
            status: zone.status,
            sku: `${activeCompany.cargoSku}-PL${pid}`,
            weight: `${(380 + Math.floor(Math.random() * 50))} kg`
          };

          palletsGroup.add(boxMesh);
          palletMeshes.push(boxMesh);

          // 3D IoT Sensor Beacon Node on top of pallet box
          const sensorGeo = new THREE.SphereGeometry(0.12, 16, 16);
          const sensorMat = new THREE.MeshStandardMaterial({
            color: zone.status === 'Ideal' ? 0x10b981 : 0xf59e0b,
            emissive: zone.status === 'Ideal' ? 0x10b981 : 0xf59e0b,
            emissiveIntensity: 0.8
          });
          const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
          sensorMesh.position.set(x, boxHeight + 0.25, z);
          palletsGroup.add(sensorMesh);
        }
      }
    });

    // Raycaster for Clicking Pallets inside 3D Container
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(palletMeshes);

      if (intersects.length > 0) {
        const clickedData = intersects[0].object.userData;
        setSelectedPallet(clickedData);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);

    // Animation Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow pan of camera in 3D mode
      if (viewMode === 'cutaway' && palletsGroupRef.current) {
        palletsGroupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeCompany, viewMode]);

  return (
    <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', height: '460px' }}>
      {/* Header Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#00f2fe" />
            Planta Virtual 3D do Contêiner / Baú
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Distribuição Interna de Cargas & Sensores Térmicos IoT
          </div>
        </div>

        {/* View Mode & Actions */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${viewMode === 'cutaway' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('cutaway')}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            Visão 3D Corte
          </button>
          <button
            className={`btn ${viewMode === 'top' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('top')}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            Planta Superior 2D/3D
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'pointer' }} />

      {/* X-Ray Pallet Inspection Modal Overlay */}
      {selectedPallet && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          width: '320px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #00f2fe',
          borderRadius: '14px',
          padding: '16px',
          zIndex: 20,
          boxShadow: '0 10px 30px rgba(0, 242, 254, 0.2)',
          animation: 'fade-in 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="badge badge-cyan">Inspecionando Palete #{selectedPallet.id}</span>
            <button
              onClick={() => setSelectedPallet(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>

          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '4px 0', color: '#f8fafc' }}>
            {selectedPallet.item}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', margin: '10px 0' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8' }}>SKU Carga:</div>
              <strong className="mono-font" style={{ color: '#00f2fe' }}>{selectedPallet.sku}</strong>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8' }}>Peso Bruto:</div>
              <strong style={{ color: '#f8fafc' }}>{selectedPallet.weight}</strong>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8' }}>Zona Interna:</div>
              <strong style={{ color: '#cbd5e1' }}>{selectedPallet.zone}</strong>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 8px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8' }}>Temp. Local:</div>
              <strong style={{ color: selectedPallet.temp > activeCompany.targetTempMax ? '#ef4444' : '#10b981' }}>
                {selectedPallet.temp}°C
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
            <span style={{ color: '#94a3b8' }}>Status IoT:</span>
            <span className={`badge ${selectedPallet.status === 'Ideal' ? 'badge-green' : 'badge-amber'}`}>
              {selectedPallet.status}
            </span>
          </div>
        </div>
      )}

      {/* Floating Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        fontSize: '0.75rem',
        color: '#94a3b8',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '6px 12px',
        borderRadius: '20px',
        pointerEvents: 'none'
      }}>
        🔍 Clique em qualquer palete/caixa 3D dentro do contêiner para abrir o raio-X da carga
      </div>
    </div>
  );
}
