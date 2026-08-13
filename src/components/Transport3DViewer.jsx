import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Box, Info } from 'lucide-react';

export default function Transport3DViewer({ activeCompany }) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [radarActive, setRadarActive] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const vehicleGroupRef = useRef(null);
  const animFrameRef = useRef(null);
  const autoRotateRef = useRef(autoRotate);

  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(14, 10, 18);
    camera.lookAt(0, 1, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.5);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    fillLight.position.set(-20, -10, -20);
    scene.add(fillLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x00f2fe, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Ground reflective plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x070a13,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Vehicle Group
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);
    vehicleGroupRef.current = vehicleGroup;

    // Build model based on transportType
    buildVehicle3DModel(activeCompany.transportType, vehicleGroup, activeCompany.color);

    // Interactive mouse drag controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !vehicleGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      vehicleGroupRef.current.rotation.y += deltaX * 0.008;
      vehicleGroupRef.current.rotation.x += deltaY * 0.004;

      // Limit pitch angle
      vehicleGroupRef.current.rotation.x = Math.max(-0.5, Math.min(0.5, vehicleGroupRef.current.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (vehicleGroupRef.current && autoRotateRef.current && !isDragging) {
        vehicleGroupRef.current.rotation.y += 0.005;
      }

      // Floating / animation effect
      if (vehicleGroupRef.current) {
        if (activeCompany.transportType === 'ship') {
          vehicleGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
          vehicleGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.2) * 0.02;
        } else if (activeCompany.transportType === 'plane') {
          vehicleGroupRef.current.position.y = 2 + Math.sin(elapsedTime * 2) * 0.25;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
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
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeCompany]);

  const resetCamera = () => {
    if (vehicleGroupRef.current) {
      vehicleGroupRef.current.rotation.set(0, 0, 0);
      vehicleGroupRef.current.position.set(0, 0, 0);
    }
  };

  return (
    <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', height: '440px' }}>
      {/* Top Header Overlay */}
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
        <div style={{ pointerEvents: 'auto', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={16} color={activeCompany.color} />
            {activeCompany.transportName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Especificação: {activeCompany.modelSpec}
          </div>
        </div>

        {/* 3D Canvas Action Controls */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${autoRotate ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setAutoRotate(!autoRotate)}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            title="Ativar/Desativar Rotação Automática 360°"
          >
            <RotateCw size={14} />
            {autoRotate ? 'Giro Ativo' : 'Giro Pausado'}
          </button>
          <button
            className="btn btn-outline"
            onClick={resetCamera}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            title="Resetar Posição 3D"
          >
            <Eye size={14} />
            Centralizar
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Bottom Floating Info Badge */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <span className="badge badge-cyan" style={{ pointerEvents: 'auto', backdropFilter: 'blur(8px)' }}>
          <Sparkles size={12} /> Renderização Three.js WebGL 3D
        </span>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.7)', padding: '4px 10px', borderRadius: '20px' }}>
          💡 Arraste com o mouse para girar o veículo em 360°
        </span>
      </div>
    </div>
  );
}

// Procedural 3D Generators for different vehicles using Three.js
function buildVehicle3DModel(type, group, brandColorHex) {
  // Clear previous meshes
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const brandColor = new THREE.Color(brandColorHex);

  if (type === 'truck') {
    // 1. REFRIGERATED TRUCK MODEL (Caminhão Frigorífico)
    // Cabin
    const cabinGeo = new THREE.BoxGeometry(2.4, 2.6, 2.2);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-3.5, 1.3, 0);
    group.add(cabin);

    // Windshield
    const glassGeo = new THREE.BoxGeometry(0.1, 1.0, 1.9);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(-4.71, 1.7, 0);
    group.add(glass);

    // Grille & Headlights
    const grilleGeo = new THREE.BoxGeometry(0.1, 0.8, 1.8);
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.set(-4.71, 0.7, 0);
    group.add(grille);

    // Refrigerator Trailer Box (Baú Frigorífico)
    const boxGeo = new THREE.BoxGeometry(7.5, 3.2, 2.6);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(1.5, 1.8, 0);
    group.add(box);

    // ThermoKing AC Unit on Front of Box
    const acGeo = new THREE.BoxGeometry(0.8, 1.4, 2.0);
    const acMat = new THREE.MeshStandardMaterial({ color: brandColor, metalness: 0.6 });
    const acUnit = new THREE.Mesh(acGeo, acMat);
    acUnit.position.set(-2.4, 2.3, 0);
    group.add(acUnit);

    // Side Decal / Stripe
    const stripeGeo = new THREE.BoxGeometry(7.4, 0.4, 2.62);
    const stripeMat = new THREE.MeshStandardMaterial({ color: brandColor, metalness: 0.5 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(1.5, 1.8, 0);
    group.add(stripe);

    // Wheels (6 wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8 });

    const wheelPositions = [
      [-3.5, 0.6, 1.1], [-3.5, 0.6, -1.1],
      [1.0, 0.6, 1.1], [1.0, 0.6, -1.1],
      [3.8, 0.6, 1.1], [3.8, 0.6, -1.1]
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, y, z);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.42, 12), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(x, y, z);

      group.add(wheel);
      group.add(rim);
    });

  } else if (type === 'ship') {
    // 2. CONTAINER SHIP MODEL (Navio Porta-Contêineres)
    // Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-6, 0);
    hullShape.lineTo(6, 0);
    hullShape.lineTo(8, 2);
    hullShape.lineTo(-6, 2);
    hullShape.closePath();

    const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.4 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.set(0, 0, -1.5);
    group.add(hull);

    // Red Bottom Hull Line
    const redBottomGeo = new THREE.BoxGeometry(13.8, 0.8, 3.2);
    const redBottomMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const redBottom = new THREE.Mesh(redBottomGeo, redBottomMat);
    redBottom.position.set(0.5, 0.4, 0);
    group.add(redBottom);

    // Command Tower Bridge
    const bridgeGeo = new THREE.BoxGeometry(2.0, 4.0, 2.6);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(-4.0, 3.8, 0);
    group.add(bridge);

    // Containers stacked on deck
    const containerColors = [0x00f2fe, 0xef4444, 0x10b981, 0xf59e0b, 0x8b5cf6, 0x3b82f6];
    let colIdx = 0;
    for (let x = -1.5; x <= 5.5; x += 1.8) {
      for (let y = 2.4; y <= 4.2; y += 0.9) {
        for (let z = -1.0; z <= 1.0; z += 1.0) {
          const cGeo = new THREE.BoxGeometry(1.6, 0.8, 0.9);
          const cMat = new THREE.MeshStandardMaterial({
            color: containerColors[colIdx % containerColors.length],
            roughness: 0.4,
            metalness: 0.3
          });
          const cMesh = new THREE.Mesh(cGeo, cMat);
          cMesh.position.set(x, y, z);
          group.add(cMesh);
          colIdx++;
        }
      }
    }

  } else if (type === 'plane') {
    // 3. AIR CARGO FREIGHTER (Avião de Carga Boeing 777F)
    // Fuselage Body
    const fuselageGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 32);
    const fuselageMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.2 });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.position.set(0, 2, 0);
    group.add(fuselage);

    // Cockpit Nose Cone
    const noseGeo = new THREE.ConeGeometry(1.2, 2.5, 32);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.z = Math.PI / 2;
    nose.position.set(-7.25, 2, 0);
    group.add(nose);

    // Swept Main Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(-2, -6);
    wingShape.lineTo(0.5, -6);
    wingShape.lineTo(2, 0);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.1, bevelEnabled: false });
    const wingMat = new THREE.MeshStandardMaterial({ color: brandColor, metalness: 0.6 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.rotation.x = Math.PI / 2;
    wings.position.set(0, 2, 0);
    group.add(wings);

    // Turbofan Jet Engines under wings
    const engineGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 24);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    [-2.5, 2.5].forEach(zPos => {
      const eng = new THREE.Mesh(engineGeo, engineMat);
      eng.rotation.z = Math.PI / 2;
      eng.position.set(-0.5, 1.2, zPos);
      group.add(eng);
    });

  } else if (type === 'train') {
    // 4. FREIGHT LOCOMOTIVE (Trem de Carga)
    // Locomotive Body
    const locGeo = new THREE.BoxGeometry(6.0, 2.8, 2.2);
    const locMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.3 });
    const loc = new THREE.Mesh(locGeo, locMat);
    loc.position.set(-3.0, 1.8, 0);
    group.add(loc);

    // Cabin Top
    const cabGeo = new THREE.BoxGeometry(2.2, 1.2, 2.2);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(-4.5, 3.2, 0);
    group.add(cab);

    // Freight Boxcar 01
    const car1Geo = new THREE.BoxGeometry(5.5, 2.6, 2.1);
    const car1Mat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4 });
    const car1 = new THREE.Mesh(car1Geo, car1Mat);
    car1.position.set(3.2, 1.7, 0);
    group.add(car1);

    // Rails beneath train
    const railGeo = new THREE.BoxGeometry(16, 0.15, 0.1);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    [-0.8, 0.8].forEach(z => {
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(0, 0.08, z);
      group.add(rail);
    });
  }
}
