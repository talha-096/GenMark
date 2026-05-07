import React, { useEffect, useRef } from 'react';

/**
 * ASMRStaticBackground
 * Reactive charcoal and glass dust particles.
 * Optimized to be transparent so it can be layered over other backgrounds.
 */
const ASMRStaticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    const PARTICLE_COUNT = 800;
    const MAGNETIC_RADIUS = 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = 0.12;

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;
      alpha = 0;
      color = '';
      rotation = 0;
      rotationSpeed = 0;
      frictionGlow = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        // 75% Charcoal, 25% Glass
        const isGlass = Math.random() > 0.75;
        this.color = isGlass ? '240, 250, 255' : '140, 140, 145';
        this.alpha = Math.random() * 0.4 + 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.frictionGlow = 0;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist > 0) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 8;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 8;
          this.frictionGlow = force * 0.6;
        } else {
          this.frictionGlow *= 0.94;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vx += (Math.random() - 0.5) * 0.03;
        this.vy += (Math.random() - 0.5) * 0.03;
        this.rotation += this.rotationSpeed + (Math.abs(this.vx) + Math.abs(this.vy)) * 0.04;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        const finalAlpha = Math.min(this.alpha + this.frictionGlow, 0.8);
        c.fillStyle = `rgba(${this.color}, ${finalAlpha})`;

        if (this.frictionGlow > 0.3) {
          c.shadowBlur = 6 * this.frictionGlow;
          c.shadowColor = `rgba(180, 210, 255, ${this.frictionGlow})`;
        }

        c.beginPath();
        c.moveTo(0, -this.size * 2);
        c.lineTo(this.size, 0);
        c.lineTo(0, this.size * 2);
        c.lineTo(-this.size, 0);
        c.closePath();
        c.fill();
        c.restore();
      }
    }

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const render = () => {
      // CLEAR the canvas instead of filling with opaque black
      // This allows the Neural background underneath to be visible
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.update();
        p.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    init();
    render();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block w-full h-full"
      aria-hidden="true"
    />
  );
};

export default ASMRStaticBackground;
