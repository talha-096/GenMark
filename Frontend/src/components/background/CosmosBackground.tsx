import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing';
import { gsap } from 'gsap';
import { particlesVert, particlesFrag, gridFrag, gridVert } from './shaders';

export const CosmosBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Performance Check for Mobile
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      if (mountRef.current) {
        mountRef.current.style.background = 'radial-gradient(ellipse at 20% 50%, #001a4d 0%, #050810 60%), radial-gradient(ellipse at 80% 20%, #1a0533 0%, transparent 50%)';
      }
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050810, 0.002);
    
    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
    camera.position.z = 0;
    
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Uniforms
    const uniforms = {
      time: { value: 0 },
      scrollProgress: { value: 0 }
    };

    // Layer 0: Void (Deep Field Particles)
    const particleCount = 20000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pSize = new Float32Array(particleCount);
    const pOpacity = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Sphere spread
      const r = 400 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i*3+2] = (r * Math.cos(phi)) - 200; // Shift back Z:-200
      pSize[i] = 0.3 + Math.random() * 1.2;
      pOpacity[i] = 0.4 + Math.random() * 0.6;
    }
    
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute('opacity', new THREE.BufferAttribute(pOpacity, 1));
    
    const pMat = new THREE.ShaderMaterial({
      vertexShader: particlesVert,
      fragmentShader: particlesFrag,
      uniforms: {
        time: uniforms.time,
        scrollProgress: uniforms.scrollProgress,
        color: { value: new THREE.Color(0xaaccff) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Layer 1: Nebula
    const nebGroups = new THREE.Group();
    nebGroups.position.z = -100;
    const nebCanvas = document.createElement('canvas');
    nebCanvas.width = 256; nebCanvas.height = 256;
    const nbCtx = nebCanvas.getContext('2d')!;
    const grad = nbCtx.createRadialGradient(128,128,0, 128,128,128);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    nbCtx.fillStyle = grad;
    nbCtx.fillRect(0,0,256,256);
    const nebTex = new THREE.CanvasTexture(nebCanvas);

    const colors = [0x1a0533, 0x001a4d, 0x001a1a];
    colors.forEach((c) => {
      const p = new THREE.Mesh(
        new THREE.PlaneGeometry(800, 800),
        new THREE.MeshBasicMaterial({ 
          map: nebTex, 
          color: c, 
          transparent: true, 
          blending: THREE.AdditiveBlending,
          opacity: 0.1,
          depthWrite: false
        })
      );
      p.rotation.z = Math.random() * Math.PI * 2;
      p.userData = { vr: (Math.random() - 0.5) * 0.001 };
      nebGroups.add(p);
    });
    scene.add(nebGroups);

    // Layer 2: Neural Grid
    const gMat = new THREE.ShaderMaterial({
      vertexShader: gridVert,
      fragmentShader: gridFrag,
      transparent: true,
      uniforms: uniforms,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(600, 600, 80, 80), gMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -30;
    grid.position.z = -30;
    scene.add(grid);

    // Layer 3: Geometric Solids
    const solids = new THREE.Group();
    solids.position.z = -20;
    const sMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, wireframe: true, opacity: 0.15, transparent: true });
    
    [
      new THREE.IcosahedronGeometry(8, 1), new THREE.IcosahedronGeometry(8, 1),
      new THREE.OctahedronGeometry(6, 0), new THREE.OctahedronGeometry(6, 0),
      new THREE.TetrahedronGeometry(5, 0), new THREE.TetrahedronGeometry(5, 0),
      new THREE.TorusGeometry(7, 0.5, 8, 12), new THREE.TorusGeometry(7, 0.5, 8, 12)
    ].forEach(geo => {
      const m = new THREE.Mesh(geo, sMat);
      m.position.set((Math.random()-0.5)*160, (Math.random()-0.5)*80, (Math.random()-0.5)*50);
      m.userData = { 
        rx: Math.random() * 0.01, 
        ry: Math.random() * 0.01,
        y0: m.position.y,
        phase: Math.random() * Math.PI * 2
      };
      solids.add(m);
    });
    scene.add(solids);

    // Layer 4: Ambient Orbs
    const orbs = new THREE.Group();
    const addOrb = (c: number, x: number, y: number) => {
      const o = new THREE.Mesh(
        new THREE.SphereGeometry(40, 16, 16),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending })
      );
      o.position.set(x,y,0);
      o.userData = { phase: Math.random() * Math.PI * 2 };
      orbs.add(o);
    };
    addOrb(0x0044aa, 50, 40);
    addOrb(0x440088, -50, -40);
    addOrb(0x001144, 0, 0);
    scene.add(orbs);

    // Composer setup
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomEffect = new BloomEffect({
      intensity: 1.5,
      luminanceThreshold: 0.75,
      luminanceSmoothing: 0.8
    });
    composer.addPass(new EffectPass(camera, bloomEffect));

    // Animation Loop
    let t = 0;
    let req: number;
    let targetRx = 0;
    let targetRy = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRx = ny * 0.05;
      targetRy = nx * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll sync Global var
    const scrollObj = { p: 0 };
    gsap.to(scrollObj, {
      p: 1,
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
    });

    const animate = () => {
      req = requestAnimationFrame(animate);
      t += 1;
      uniforms.time.value = t;
      uniforms.scrollProgress.value = scrollObj.p;

      nebGroups.children.forEach(c => { c.rotation.z += c.userData.vr; });
      
      solids.children.forEach(c => {
        c.rotation.x += c.userData.rx;
        c.rotation.y += c.userData.ry;
        c.position.y = c.userData.y0 + Math.sin(t * 0.01 + c.userData.phase) * 5;
      });

      orbs.children.forEach(c => {
        const s = 0.9 + Math.sin(t * 0.008 + c.userData.phase) * 0.1;
        c.scale.set(s,s,s);
      });

      // Mouse parallax
      solids.rotation.x += (targetRx - solids.rotation.x) * 0.05;
      solids.rotation.y += (targetRy - solids.rotation.y) * 0.05;

      composer.render();
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const currentMount = mountRef.current;
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(req);
      currentMount?.removeChild(renderer.domElement);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      composer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
