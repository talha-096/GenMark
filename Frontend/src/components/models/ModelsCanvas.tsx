import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { createProceduralModels } from "./ProceduralModels";

export interface ModelsCanvasHandle {
  getModels: () => Record<string, THREE.Object3D>;
  getCamera: () => THREE.PerspectiveCamera;
  getScene: () => THREE.Scene;
}

export const ModelsCanvas = React.memo(
  forwardRef<ModelsCanvasHandle>((_, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const modelsRef = useRef<Record<string, THREE.Object3D>>({});
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useImperativeHandle(ref, () => ({
      getModels: () => modelsRef.current,
      getCamera: () => cameraRef.current!,
      getScene: () => sceneRef.current!,
    }));

    useEffect(() => {
      if (!mountRef.current) return;

      const mountNode = mountRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
      camera.position.z = 20; // Default view position
      cameraRef.current = camera;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        });
      } catch (e) {
        console.warn("WebGL initialization failed, bypassing 3D background.", e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      mountNode.appendChild(renderer.domElement);

      // Environment & Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0x3b82f6, 1500);
      pointLight.position.set(20, 20, 20);
      scene.add(pointLight);

      const accentLight = new THREE.PointLight(0xa855f7, 800);
      accentLight.position.set(-20, -20, 10);
      scene.add(accentLight);

      // --- HYPER-WARP SCROLLING BACKGROUND ---
      const lineCount = 1500;
      const lineGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(lineCount * 6); // 2 vertices per line (start and end)
      const colorArray = new Float32Array(lineCount * 6);
      
      // Colors matching the reference image: Bright Blues, Oranges, Pinks, Purples, White
      const palette = [
         new THREE.Color("#3b82f6"), // Blue
         new THREE.Color("#60a5fa"), // Light Blue
         new THREE.Color("#f97316"), // Orange
         new THREE.Color("#fbbf24"), // Yellow/Orange
         new THREE.Color("#ec4899"), // Pink
         new THREE.Color("#8b5cf6"), // Purple
         new THREE.Color("#ffffff"), // White
      ];

      for(let i = 0; i < lineCount; i++) {
         // Create a tunnel distribution (ignore the very center)
         const radius = Math.random() * 80 + 2; 
         const angle = Math.random() * Math.PI * 2;
         const x = Math.cos(angle) * radius;
         const y = Math.sin(angle) * radius;
         const z = (Math.random() - 0.5) * 400; // Random starting depth

         const length = Math.random() * 10 + 2; 

         // Start vertex
         posArray[i*6] = x;
         posArray[i*6+1] = y;
         posArray[i*6+2] = z;

         // End vertex (stretched along Z)
         posArray[i*6+3] = x;
         posArray[i*6+4] = y;
         posArray[i*6+5] = z + length;

         // Get a random color for the streak, with a bias towards blue/orange
         const c = palette[Math.floor(Math.random() * palette.length)];
         
         // Smooth fade from bright head to dark tail
         colorArray[i*6] = c.r;
         colorArray[i*6+1] = c.g;
         colorArray[i*6+2] = c.b;
         
         // Trail is slightly darker
         colorArray[i*6+3] = c.r * 0.3;
         colorArray[i*6+4] = c.g * 0.3;
         colorArray[i*6+5] = c.b * 0.3;
      }
      
      lineGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      lineGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        linewidth: 2, // Note: WebGL standard restricts this to 1 usually, but additive blending gives it thickness
      });
      
      const warpLines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(warpLines);
      modelsRef.current.warpLines = warpLines;

      // Brand Aura (Background Dark Gradient Sphere)
      const auraGeo = new THREE.SphereGeometry(60, 32, 32);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0x070b14,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.2
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      scene.add(aura);
      modelsRef.current.brandAura = aura;

      // Keep Models Initialization
      const models = createProceduralModels(scene);
      Object.assign(modelsRef.current, models);

      // Track Scroll for live reactive speed
      let currentScroll = window.scrollY;
      let targetScroll = window.scrollY;
      let scrollVelocity = 0;

      const handleScroll = () => {
         targetScroll = window.scrollY;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      let req: number;
      const animate = (time: number) => {
        req = requestAnimationFrame(animate);
        
        // Calculate smooth scroll velocity
        const scrollDelta = targetScroll - currentScroll;
        currentScroll += scrollDelta * 0.1;
        
        // Apply a base base velocity, and add a heavy multiplier based on how fast you are scrolling
        scrollVelocity = Math.abs(scrollDelta) * 0.05;
        // Dampen velocity smoothly
        const activeSpeed = 0.3 + scrollVelocity; 
        const speedMultiplier = Math.min(activeSpeed, 15); // Cap max speed
        
        // Update Warp Lines
        if (warpLines) {
           const positions = lineGeo.attributes.position.array as Float32Array;
           for(let i=0; i < lineCount; i++) {
              // Extract the starting Z and modify
              let zStart = positions[i*6+2];
              
              // Move towards camera (+Z)
              zStart += speedMultiplier;
              
              // Tail stretches out behind based on current speed
              // A higher speed = a longer light tail
              const stretch = Math.max(5, speedMultiplier * 8);
              
              // Update Head
              positions[i*6+2] = zStart;
              // Update Tail
              positions[i*6+5] = zStart - stretch;

              // If particle passes camera, reset back
              if (zStart > 30) {
                 positions[i*6+2] = -300 - Math.random() * 50; 
                 positions[i*6+5] = positions[i*6+2] - stretch;
              }
           }
           lineGeo.attributes.position.needsUpdate = true;
           
           // Slight rotation for the entire warp tunnel to give it a spiraling effect
           warpLines.rotation.z = time * 0.0002;
        }

        const m = modelsRef.current;
        if (m.neuralBrain && m.neuralBrain.visible) {
            m.neuralBrain.rotation.y += 0.012 + (speedMultiplier * 0.001); // Spin faster on scroll
            m.neuralBrain.rotation.x += 0.005; 
        }
        if (m.brandRing && m.brandRing.visible) {
            m.brandRing.rotation.z += 0.025 + (speedMultiplier * 0.002);
        }

        renderer.render(scene, camera);
      };
      animate(0);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(req);
        if (mountNode) mountNode.removeChild(renderer.domElement);
        
        // Clean up
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(m => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        renderer.dispose();
      };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
  })
);
ModelsCanvas.displayName = "ModelsCanvas";
