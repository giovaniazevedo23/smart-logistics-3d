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

    // 1. Scene setup (Studio Warm Background matching photo)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x362f27);
    scene.fog = new THREE.FogExp2(0x362f27, 0.015);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 7, 19);
    camera.lookAt(0, 1.5, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting (Warm Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.6);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xeab308, 0.6);
    fillLight.position.set(-20, -10, -20);
    scene.add(fillLight);

    // Studio reflective ground plane
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x2b241e,
      roughness: 0.75,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Vehicle Group
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);
    vehicleGroupRef.current = vehicleGroup;

    // Build model based on transportType
    if (activeCompany.id !== 'frigorifico-silva') {
      buildVehicle3DModel(activeCompany.transportType, vehicleGroup, activeCompany.color);
    }

    // Interactive mouse hover & drag rotation control
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onPointerMove = (e) => {
      if (!vehicleGroupRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (lastMouseX !== 0) {
        const deltaX = mouseX - lastMouseX;
        const deltaY = mouseY - lastMouseY;

        vehicleGroupRef.current.rotation.y += deltaX * 0.008;
        vehicleGroupRef.current.rotation.x += deltaY * 0.004;

        // Limit pitch angle
        vehicleGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, vehicleGroupRef.current.rotation.x));
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const onPointerLeave = () => {
      lastMouseX = 0;
      lastMouseY = 0;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousemove', onPointerMove);
    domEl.addEventListener('mouseleave', onPointerLeave);
    domEl.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        onPointerMove(e.touches[0]);
      }
    });

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (vehicleGroupRef.current && autoRotateRef.current && lastMouseX === 0) {
        vehicleGroupRef.current.rotation.y += 0.004;
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

      {/* 3D Canvas Mount Point - Only show if not using Sketchfab iframe */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          cursor: 'grab', 
          position: 'relative', 
          zIndex: 1,
          display: activeCompany.id === 'frigorifico-silva' ? 'none' : 'block'
        }} 
      />

      {/* Sketchfab Iframe Embed for Frigorifico Silva */}
      {activeCompany.id === 'frigorifico-silva' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 5
        }}>
          <iframe 
            title="Amostra - Caminhão Frigorifico Silva" 
            frameBorder="0" 
            allowFullScreen 
            mozallowfullscreen="true" 
            webkitallowfullscreen="true" 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true" 
            src="https://sketchfab.com/models/477df99208b349129de9e935827b2c25/embed?autostart=1&transparent=1&ui_controls=0&ui_infos=0&ui_watermark=0"
            style={{ width: '100%', height: '100%' }}
          ></iframe>
        </div>
      )}

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
          <Sparkles size={12} /> {activeCompany.id === 'frigorifico-silva' ? 'Sketchfab 3D Model' : 'Renderização Three.js WebGL 3D'}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.7)', padding: '4px 10px', borderRadius: '20px' }}>
          💡 {activeCompany.id === 'frigorifico-silva' ? 'Interaja com o modelo 3D usando o mouse' : 'Arraste com o mouse para girar o veículo em 360°'}
        </span>
      </div>
    </div>
  );
}

// Procedural 3D Generators for different vehicles using Three.js

// 1. Generate Realistic Frigorífico Silva / BestBeef Side Decal Texture
function createRefrigeratedTrailerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Background: Dark Rustic Wood Panels
  ctx.fillStyle = '#120e0c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const boardHeight = 64;
  for (let y = 0; y < canvas.height; y += boardHeight) {
    const shade = Math.floor(16 + (Math.sin(y) * 0.5 + 0.5) * 12);
    ctx.fillStyle = `rgb(${shade + 6}, ${shade + 2}, ${shade})`;
    ctx.fillRect(0, y, canvas.width, boardHeight - 2);

    ctx.fillStyle = '#060504';
    ctx.fillRect(0, y + boardHeight - 2, canvas.width, 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + boardHeight / 2);
    ctx.lineTo(canvas.width, y + boardHeight / 2);
    ctx.stroke();
  }

  // Dark Radial Vignette on Left Side
  const grad = ctx.createRadialGradient(400, 480, 80, 400, 480, 520);
  grad.addColorStop(0, 'rgba(18, 14, 12, 0.1)');
  grad.addColorStop(1, 'rgba(8, 6, 5, 0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 880, canvas.height);

  // Bull Head Artwork Profile
  ctx.save();
  const bullX = 400;
  const bullY = 460;

  // Bull Head Silhouette
  ctx.fillStyle = '#1a1310';
  ctx.beginPath();
  ctx.ellipse(bullX, bullY - 20, 160, 210, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Forehead Fur Gradient
  const headGrad = ctx.createRadialGradient(bullX - 20, bullY - 50, 20, bullX, bullY, 170);
  headGrad.addColorStop(0, '#8c5332'); // Warm Angus fur highlight
  headGrad.addColorStop(0.4, '#4a2c1b');
  headGrad.addColorStop(1, '#140e0b');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(bullX - 10, bullY - 40, 145, 185, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle & Snout
  ctx.fillStyle = '#2c1f18';
  ctx.beginPath();
  ctx.ellipse(bullX - 15, bullY + 110, 85, 65, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nostrils
  ctx.fillStyle = '#0c0806';
  ctx.beginPath();
  ctx.ellipse(bullX - 45, bullY + 115, 18, 12, -0.2, 0, Math.PI * 2);
  ctx.ellipse(bullX + 15, bullY + 115, 18, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Horns
  ctx.fillStyle = '#d1c7b7';
  ctx.beginPath();
  ctx.moveTo(bullX - 110, bullY - 140);
  ctx.quadraticCurveTo(bullX - 220, bullY - 220, bullX - 170, bullY - 260);
  ctx.quadraticCurveTo(bullX - 140, bullY - 200, bullX - 90, bullY - 150);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(bullX + 90, bullY - 140);
  ctx.quadraticCurveTo(bullX + 200, bullY - 220, bullX + 160, bullY - 260);
  ctx.quadraticCurveTo(bullX + 130, bullY - 200, bullX + 70, bullY - 150);
  ctx.closePath();
  ctx.fill();

  // Intelligent Eyes
  ctx.fillStyle = '#080605';
  ctx.beginPath();
  ctx.ellipse(bullX - 85, bullY - 45, 16, 12, -0.2, 0, Math.PI * 2);
  ctx.ellipse(bullX + 65, bullY - 45, 16, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(bullX - 88, bullY - 48, 4, 0, Math.PI * 2);
  ctx.arc(bullX + 62, bullY - 48, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Circular Green "COMPROMISSO SUSTENTÁVEL" Badge
  ctx.save();
  const badgeX = 360;
  const badgeY = 820;

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 105, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 98, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 90, 0, Math.PI * 2);
  ctx.fill();

  // Green Leaf Icon
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.moveTo(badgeX - 10, badgeY + 35);
  ctx.bezierCurveTo(badgeX - 55, badgeY - 20, badgeX - 10, badgeY - 55, badgeX + 25, badgeY - 45);
  ctx.bezierCurveTo(badgeX + 45, badgeY, badgeX + 15, badgeY + 35, badgeX - 10, badgeY + 35);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMPROMISSO', badgeX, badgeY + 52);
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillText('SUSTENTÁVEL', badgeX, badgeY + 70);
  ctx.restore();

  // Frigorífico Silva Logo Text & Banner
  const silvaX = 960;
  const silvaY = 480;

  ctx.save();
  // Red, Yellow, Green Ribbon Flag
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(silvaX, silvaY - 80);
  ctx.lineTo(silvaX + 80, silvaY - 95);
  ctx.lineTo(silvaX + 70, silvaY + 30);
  ctx.lineTo(silvaX - 10, silvaY + 45);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(silvaX + 40, silvaY - 88);
  ctx.lineTo(silvaX + 110, silvaY - 100);
  ctx.lineTo(silvaX + 100, silvaY + 20);
  ctx.lineTo(silvaX + 30, silvaY + 35);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.moveTo(silvaX + 80, silvaY - 95);
  ctx.lineTo(silvaX + 140, silvaY - 105);
  ctx.lineTo(silvaX + 130, silvaY + 10);
  ctx.lineTo(silvaX + 70, silvaY + 25);
  ctx.closePath();
  ctx.fill();

  // Frigorífico Silva Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 84px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 12;
  ctx.fillText('Frigorífico Silva', silvaX + 160, silvaY - 10);

  ctx.font = 'italic 36px Georgia, serif';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText('Desde 1972', silvaX + 440, silvaY + 35);
  ctx.restore();

  // Yellow "BestBeef" Badge
  const beefX = 1440;
  const beefY = 620;
  ctx.save();
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(beefX, beefY - 120, 520, 180, 24);
  ctx.fill();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#111827';
  ctx.font = '900 115px "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BestBeef', beefX + 260, beefY + 15);
  ctx.restore();

  // Red "CRYOVAC" Badge
  ctx.save();
  const cryoX = 1860;
  const cryoY = 870;
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cryoX, cryoY, 160, 52);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CRYOVAC', cryoX + 80, cryoY + 35);
  ctx.restore();

  // Red & White Reflective Safety Tape
  const tapeY = canvas.height - 35;
  const stripeWidth = 60;
  for (let x = 0; x < canvas.width; x += stripeWidth * 2) {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x, tapeY, stripeWidth, 25);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + stripeWidth, tapeY, stripeWidth, 25);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Generate Cab Door "BestBeef" Badge Texture
function createCabDoorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.roundRect(90, 200, 332, 115, 18);
  ctx.fill();

  ctx.fillStyle = '#111827';
  ctx.font = '900 68px "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BestBeef', 256, 282);

  return new THREE.CanvasTexture(canvas);
}

// 3. Generate Volkswagen Constellation Front Grille Texture with VW Chrome Logo
function createVWGrilleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 4;
  for (let x = 0; x < 512; x += 16) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 0; y < 512; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  ctx.fillStyle = '#374151';
  ctx.fillRect(20, 110, 472, 18);
  ctx.fillRect(20, 240, 472, 18);
  ctx.fillRect(20, 370, 472, 18);

  // VW Chrome Emblem
  const cx = 256;
  const cy = 240;
  const r = 90;

  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(cx, cy, r - 12, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';

  // V
  ctx.beginPath();
  ctx.moveTo(cx - 36, cy - 42);
  ctx.lineTo(cx, cy - 2);
  ctx.lineTo(cx + 36, cy - 42);
  ctx.stroke();

  // W
  ctx.beginPath();
  ctx.moveTo(cx - 48, cy - 5);
  ctx.lineTo(cx - 24, cy + 50);
  ctx.lineTo(cx, cy + 10);
  ctx.lineTo(cx + 24, cy + 50);
  ctx.lineTo(cx + 50, cy - 5);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

function buildVehicle3DModel(type, group, brandColorHex) {
  // Clear previous meshes
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const brandColor = new THREE.Color(brandColorHex);

  if (type === 'truck') {
    // ==========================================
    // REALISTIC SEMI-TRAILER REFRIGERATED TRUCK
    // (VW Constellation + Frigorífico Silva / BestBeef)
    // ==========================================

    const trailerSideTexture = createRefrigeratedTrailerTexture();
    const doorTexture = createCabDoorTexture();
    const vwGrilleTexture = createVWGrilleTexture();

    // --- 1. TRACTOR CABIN (VW Constellation Cavalo Mecânico) ---
    const cabGroup = new THREE.Group();
    cabGroup.position.set(-4.2, 0, 0);

    // Main Cab Body
    const cabinGeo = new THREE.BoxGeometry(2.5, 2.7, 2.3);
    const whitePaintMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.2
    });
    const cabinMesh = new THREE.Mesh(cabinGeo, whitePaintMat);
    cabinMesh.position.set(0, 2.2, 0);
    cabinMesh.castShadow = true;
    cabGroup.add(cabinMesh);

    // Dark Sun Visor (Quebra-Sol VW acima do para-brisa)
    const visorGeo = new THREE.BoxGeometry(0.2, 0.25, 2.25);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(-1.26, 3.4, 0);
    cabGroup.add(visor);

    // Aerodynamic Roof Deflector / Wind Spoiler
    const spoilerShape = new THREE.Shape();
    spoilerShape.moveTo(-1.25, 0);
    spoilerShape.lineTo(1.25, 0);
    spoilerShape.lineTo(0.9, 0.6);
    spoilerShape.lineTo(-1.1, 0.6);
    spoilerShape.closePath();
    const spoilerGeo = new THREE.ExtrudeGeometry(spoilerShape, { depth: 2.25, bevelEnabled: true, bevelSize: 0.05 });
    const spoilerMesh = new THREE.Mesh(spoilerGeo, whitePaintMat);
    spoilerMesh.rotation.y = Math.PI / 2;
    spoilerMesh.position.set(-1.12, 3.55, -1.12);
    cabGroup.add(spoilerMesh);

    // Windshield (Black/Blue Tinted Glass)
    const glassGeo = new THREE.BoxGeometry(0.08, 1.1, 2.1);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(-1.26, 2.65, 0);
    cabGroup.add(glass);

    // Windshield Wiper Blades (Limpadores de para-brisa)
    const wiperMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    [-0.5, 0.4].forEach(zPos => {
      const wiper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.05), wiperMat);
      wiper.rotation.z = -0.3;
      wiper.position.set(-1.29, 2.5, zPos);
      cabGroup.add(wiper);
    });

    // Side Door Decal (BestBeef Logo on Door)
    const doorDecalMat = new THREE.MeshStandardMaterial({ map: doorTexture, roughness: 0.3 });
    const leftDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), doorDecalMat);
    leftDoor.rotation.y = Math.PI / 2;
    leftDoor.position.set(0.1, 2.1, 1.16);
    cabGroup.add(leftDoor);

    const rightDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), doorDecalMat);
    rightDoor.rotation.y = -Math.PI / 2;
    rightDoor.position.set(0.1, 2.1, -1.16);
    cabGroup.add(rightDoor);

    // Front Grille with VW Chrome Emblem
    const grillePlaneGeo = new THREE.PlaneGeometry(1.0, 2.1);
    const vwGrilleMat = new THREE.MeshStandardMaterial({ map: vwGrilleTexture, roughness: 0.3 });
    const grilleMesh = new THREE.Mesh(grillePlaneGeo, vwGrilleMat);
    grilleMesh.rotation.y = -Math.PI / 2;
    grilleMesh.position.set(-1.26, 1.45, 0);
    cabGroup.add(grilleMesh);

    // Headlights (Chrome Reflectors with LED Lenses)
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.5 });
    [-0.85, 0.85].forEach(zPos => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.35), headlightMat);
      hl.position.set(-1.26, 1.05, zPos);
      cabGroup.add(hl);
    });

    // Side Mirrors
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    [-1.22, 1.22].forEach(zPos => {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.15), mirrorMat);
      mirror.position.set(-0.8, 2.6, zPos);
      cabGroup.add(mirror);
    });

    // Metallic Diamond Plate Catwalk Platform (Atrás da cabine)
    const plateGeo = new THREE.BoxGeometry(1.8, 0.1, 2.2);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(1.2, 0.85, 0);
    cabGroup.add(plate);

    // Dual Polished Chrome Fuel Tanks (Tanques de Combustível de Alumínio)
    const tankGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.8, 24);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    [-1.18, 1.18].forEach(zPos => {
      const tank = new THREE.Mesh(tankGeo, chromeMat);
      tank.rotation.z = Math.PI / 2;
      tank.position.set(0.6, 0.55, zPos);
      cabGroup.add(tank);

      // Tank Straps
      [-0.4, 0.4].forEach(xOff => {
        const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 24), strapMat);
        strap.rotation.z = Math.PI / 2;
        strap.position.set(0.6 + xOff, 0.55, zPos);
        cabGroup.add(strap);
      });
    });

    group.add(cabGroup);

    // --- 2. REFRIGERATED SEMI-TRAILER (Carreta Baú Frigorífico) ---
    const trailerGroup = new THREE.Group();
    trailerGroup.position.set(2.8, 0, 0);

    const boxLength = 11.5;
    const boxHeight = 3.6;
    const boxWidth = 2.6;

    // Multi-Material for Box Faces
    const sideMat = new THREE.MeshStandardMaterial({
      map: trailerSideTexture,
      roughness: 0.35,
      metalness: 0.15
    });

    const roofMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.3, roughness: 0.3 });
    const frontMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const rearDoorsMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.2 });

    const boxMaterials = [
      sideMat,       // Right side (+X face of box, mapped to trailer right wall)
      sideMat,       // Left side (-X face)
      roofMat,       // Top roof (+Y)
      frontMat,      // Bottom floor (-Y)
      frontMat,      // Front wall (+Z)
      rearDoorsMat   // Rear doors (-Z)
    ];

    const boxGeo = new THREE.BoxGeometry(boxLength, boxHeight, boxWidth);
    const boxMesh = new THREE.Mesh(boxGeo, boxMaterials);
    boxMesh.position.set(0, 2.65, 0);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    trailerGroup.add(boxMesh);

    // Polished Aluminum Bevel Frame Rails (Cantoneiras de alumínio polido ao redor do baú)
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15 });

    // Edge Trim Bars
    const edgeTopL = new THREE.Mesh(new THREE.BoxGeometry(boxLength + 0.05, 0.12, 0.12), frameMat);
    edgeTopL.position.set(0, 4.46, 1.31);
    trailerGroup.add(edgeTopL);

    const edgeTopR = new THREE.Mesh(new THREE.BoxGeometry(boxLength + 0.05, 0.12, 0.12), frameMat);
    edgeTopR.position.set(0, 4.46, -1.31);
    trailerGroup.add(edgeTopR);

    const edgeBotL = new THREE.Mesh(new THREE.BoxGeometry(boxLength + 0.05, 0.12, 0.12), frameMat);
    edgeBotL.position.set(0, 0.86, 1.31);
    trailerGroup.add(edgeBotL);

    const edgeBotR = new THREE.Mesh(new THREE.BoxGeometry(boxLength + 0.05, 0.12, 0.12), frameMat);
    edgeBotR.position.set(0, 0.86, -1.31);
    trailerGroup.add(edgeBotR);

    // Thermo King Refrigeration Unit (Aparelho de Refrigeração Frontal)
    const thermoKingGroup = new THREE.Group();
    thermoKingGroup.position.set(-5.8, 3.1, 0);

    const acBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.6, 2.1),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
    );
    thermoKingGroup.add(acBody);

    // Fan Grille
    const fanGrille = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.72, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
    );
    fanGrille.rotation.z = Math.PI / 2;
    fanGrille.position.set(0.02, 0.2, 0);
    thermoKingGroup.add(fanGrille);

    // Digital Temperature Display LED Badge
    const ledDisplay = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.25, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.8 })
    );
    ledDisplay.position.set(0.02, -0.4, 0);
    thermoKingGroup.add(ledDisplay);

    trailerGroup.add(thermoKingGroup);

    // Rear Doors Stainless Steel Locking Bars (Trincos de Inox Traseiros)
    const lockBarMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
    [-0.5, 0.5].forEach(zPos => {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, boxHeight - 0.2, 16), lockBarMat);
      bar.position.set(5.76, 2.65, zPos);
      trailerGroup.add(bar);
    });

    group.add(trailerGroup);

    // --- 3. WHEELS, AXLES & SUSPENSION (5 Axles total: 2 tractor + 3 trailer tri-dem) ---
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 32);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.1 });
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const fenderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    // Wheel positions: [x, y, z]
    const wheelPositions = [
      // Tractor Front Steering Axle
      [-5.3, 0.55, 1.15], [-5.3, 0.55, -1.15],
      // Tractor Rear Drive Axles (Duals)
      [-3.3, 0.55, 1.15], [-3.3, 0.55, -1.15],
      [-2.1, 0.55, 1.15], [-2.1, 0.55, -1.15],
      // Trailer Tri-Dem Axles
      [4.2, 0.55, 1.25], [4.2, 0.55, -1.25],
      [5.6, 0.55, 1.25], [5.6, 0.55, -1.25],
      [7.0, 0.55, 1.25], [7.0, 0.55, -1.25]
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Rubber Tire
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Polished Chrome Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.47, 16), rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Center Wheel Hub
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.49, 12), hubMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      group.add(wheelGroup);
    });

    // Trailer Rear Black Mudguards / Fenders over Tri-Dem Axles
    [4.2, 5.6, 7.0].forEach(xPos => {
      [-1.25, 1.25].forEach(zPos => {
        const fender = new THREE.Mesh(
          new THREE.CylinderGeometry(0.65, 0.65, 0.52, 16, 1, false, 0, Math.PI),
          fenderMat
        );
        fender.rotation.z = Math.PI;
        fender.rotation.y = Math.PI / 2;
        fender.position.set(xPos, 0.85, zPos);
        group.add(fender);
      });
    });

    // Rear Rubber Mudflap (Lameirão Frigorífico Silva)
    const mudflapGeo = new THREE.BoxGeometry(0.05, 0.7, 2.7);
    const mudflapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const mudflap = new THREE.Mesh(mudflapGeo, mudflapMat);
    mudflap.position.set(8.2, 0.6, 0);
    group.add(mudflap);

  } else if (type === 'ship') {
    // 2. CONTAINER SHIP MODEL (Navio Porta-Contêineres)
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

    const redBottomGeo = new THREE.BoxGeometry(13.8, 0.8, 3.2);
    const redBottomMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const redBottom = new THREE.Mesh(redBottomGeo, redBottomMat);
    redBottom.position.set(0.5, 0.4, 0);
    group.add(redBottom);

    const bridgeGeo = new THREE.BoxGeometry(2.0, 4.0, 2.6);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(-4.0, 3.8, 0);
    group.add(bridge);

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
    // 3. AIR CARGO FREIGHTER (Boeing 777F)
    const fuselageGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 32);
    const fuselageMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.2 });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.position.set(0, 2, 0);
    group.add(fuselage);

    const noseGeo = new THREE.ConeGeometry(1.2, 2.5, 32);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.z = Math.PI / 2;
    nose.position.set(-7.25, 2, 0);
    group.add(nose);

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

    const engineGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 24);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    [-2.5, 2.5].forEach(zPos => {
      const eng = new THREE.Mesh(engineGeo, engineMat);
      eng.rotation.z = Math.PI / 2;
      eng.position.set(-0.5, 1.2, zPos);
      group.add(eng);
    });

  } else if (type === 'train') {
    // 4. FREIGHT LOCOMOTIVE
    const locGeo = new THREE.BoxGeometry(6.0, 2.8, 2.2);
    const locMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.3 });
    const loc = new THREE.Mesh(locGeo, locMat);
    loc.position.set(-3.0, 1.8, 0);
    group.add(loc);

    const cabGeo = new THREE.BoxGeometry(2.2, 1.2, 2.2);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(-4.5, 3.2, 0);
    group.add(cab);

    const car1Geo = new THREE.BoxGeometry(5.5, 2.6, 2.1);
    const car1Mat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4 });
    const car1 = new THREE.Mesh(car1Geo, car1Mat);
    car1.position.set(3.2, 1.7, 0);
    group.add(car1);

    const railGeo = new THREE.BoxGeometry(16, 0.15, 0.1);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    [-0.8, 0.8].forEach(z => {
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(0, 0.08, z);
      group.add(rail);
    });
  }
}

