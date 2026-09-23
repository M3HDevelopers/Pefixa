import { useEffect, useRef } from 'react';

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const mouseThrottleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Particle data using typed arrays for performance
    const MAX_PARTICLES = 120;
    const CONNECTION_DISTANCE = 100;
    const MOUSE_RADIUS = 200;
    const MOUSE_FORCE = 0.08;

    let width = 0;
    let height = 0;
    let particleCount = 0;

    // Typed arrays for particle data (much faster than objects)
    let px: Float32Array;
    let py: Float32Array;
    let pvx: Float32Array;
    let pvy: Float32Array;
    let pradius: Float32Array;
    let popacity: Float32Array;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Adaptive particle count based on screen size
      const area = width * height;
      particleCount = Math.min(MAX_PARTICLES, Math.floor(area / 12000));

      // Initialize arrays
      px = new Float32Array(particleCount);
      py = new Float32Array(particleCount);
      pvx = new Float32Array(particleCount);
      pvy = new Float32Array(particleCount);
      pradius = new Float32Array(particleCount);
      popacity = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        px[i] = Math.random() * width;
        py[i] = Math.random() * height;
        pvx[i] = (Math.random() - 0.5) * 0.4;
        pvy[i] = (Math.random() - 0.5) * 0.4;
        pradius[i] = Math.random() * 1.5 + 0.5;
        popacity[i] = Math.random() * 0.4 + 0.15;
      }
    };

    resize();

    // Throttled mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - mouseThrottleRef.current < 16) return; // ~60fps throttle
      mouseThrottleRef.current = now;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Optimized animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mx > -500;

      // Update particles
      for (let i = 0; i < particleCount; i++) {
        // Mouse repulsion (stronger force)
        if (mouseActive) {
          const dx = px[i] - mx;
          const dy = py[i] - my;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < MOUSE_RADIUS * MOUSE_RADIUS && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
            pvx[i] += (dx / dist) * force;
            pvy[i] += (dy / dist) * force;
          }
        }

        // Apply velocity with damping
        pvx[i] *= 0.98;
        pvy[i] *= 0.98;
        px[i] += pvx[i];
        py[i] += pvy[i];

        // Boundary wrap
        if (px[i] < -10) px[i] = width + 10;
        else if (px[i] > width + 10) px[i] = -10;
        if (py[i] < -10) py[i] = height + 10;
        else if (py[i] > height + 10) py[i] = -10;
      }

      // Draw connections (optimized - only check nearby)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particleCount; i++) {
        const x1 = px[i];
        const y1 = py[i];
        let connections = 0;
        
        for (let j = i + 1; j < particleCount && connections < 3; j++) {
          const dx = x1 - px[j];
          const dy = y1 - py[j];
          const distSq = dx * dx + dy * dy;
          
          if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const opacity = (1 - Math.sqrt(distSq) / CONNECTION_DISTANCE) * 0.2;
            ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(px[j], py[j]);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particleCount; i++) {
        ctx.beginPath();
        ctx.arc(px[i], py[i], pradius[i], 0, 6.2832); // 2 * PI pre-calculated
        ctx.fillStyle = `rgba(255,255,255,${popacity[i]})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        opacity: 0.7,
      }}
    />
  );
}
