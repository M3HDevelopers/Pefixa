import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size to cover entire page
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = Math.max(document.body.scrollHeight, window.innerHeight) * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = Math.max(document.body.scrollHeight, window.innerHeight) + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    // Initialize particles - more particles, covering full page
    const pageHeight = Math.max(document.body.scrollHeight, window.innerHeight);
    const particleCount = Math.min(150, Math.floor((window.innerWidth * pageHeight) / 12000));
    
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * pageHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    // Mouse interaction - throttled for performance
    let lastMouseMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMove < 16) return; // ~60fps throttle
      lastMouseMove = now;
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    // Optimized animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const width = window.innerWidth;
      const height = Math.max(document.body.scrollHeight, window.innerHeight);
      
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 100; // Reduced for performance
      const mouseRadius = 200; // Stronger mouse interaction
      const mouseForce = 0.08; // Stronger repulsion

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Mouse repulsion - stronger effect
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < mouseRadius * mouseRadius && distSq > 0) {
          const distance = Math.sqrt(distSq);
          const force = (mouseRadius - distance) / mouseRadius * mouseForce;
          p.vx -= (dx / distance) * force;
          p.vy -= (dy / distance) * force;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Boundary bounce
        if (p.x < 0) { p.x = 0; p.vx *= -0.8; }
        if (p.x > width) { p.x = width; p.vx *= -0.8; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.8; }
        if (p.y > height) { p.y = height; p.vy *= -0.8; }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections - optimized with spatial check
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          
          // Quick distance check (squared)
          if (Math.abs(dx) > connectionDistance || Math.abs(dy) > connectionDistance) continue;
          
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistance * connectionDistance) {
            const opacity = (1 - Math.sqrt(distSq) / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.7,
        willChange: 'transform',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
    />
  );
}
