'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ─── Grid config ───────────────────────────────────────────
    // More columns + rows = denser coverage across the full viewport
    const SEPARATION = 130;
    const AMOUNTX    = 55;   // wider X sweep
    const AMOUNTY    = 70;   // more depth for scroll coverage

    // ─── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    // Fog colour matches body background (#070b14)
    scene.fog = new THREE.Fog(0x070b14, 3000, 12000);

    // ─── Camera ────────────────────────────────────────────────
    // Pull camera higher and further back so the wave fills the whole screen
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      15000,
    );
    // y=450 gives a nice bird's-eye angle; z=1500 ensures all rows are visible
    camera.position.set(0, 450, 1500);
    // Tilt down slightly so the middle of the dot grid aligns with screen center
    camera.lookAt(0, -200, 0);

    // ─── Renderer ──────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      console.warn('WebGL not supported for DottedSurface', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // ─── Geometry ──────────────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[]    = [];

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        // Muted electric blue — visible on dark background, not distracting
        colors.push(0.20, 0.33, 0.68);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 5.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.50,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ─── Animation loop ────────────────────────────────────────
    let count = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const posAttr = geometry.attributes.position;
      const pos = posAttr.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          // Wave formula: combines two sinusoids in X and Y for organic motion
          pos[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 55 +
            Math.sin((iy + count) * 0.5) * 55;
          i++;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.065; // smooth, not too fast
    };

    // ─── Resize handler ────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    animate();

    const mountNode = containerRef.current;

    // ─── Cleanup ───────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            (object.material as THREE.Material).dispose();
          }
        }
      });

      renderer.dispose();

      if (mountNode && renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      // fixed + inset-0 → always covers 100vw × 100vh regardless of scroll position
      // -z-20 → sits behind everything, including the radial glow overlay (-z-10)
      className={cn('pointer-events-none fixed inset-0 -z-20', className)}
      {...props}
    />
  );
}
