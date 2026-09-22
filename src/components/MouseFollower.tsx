import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
      
      // Calculate velocity with smoothing
      const newVelX = e.clientX - lastX.current;
      const newVelY = e.clientY - lastY.current;
      
      velocityX.current = velocityX.current * 0.7 + newVelX * 0.3;
      velocityY.current = velocityY.current * 0.7 + newVelY * 0.3;
      
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    const animate = () => {
      if (!cursor) return;

      // Calculate stretch based on velocity (liquid deformation)
      const speed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
      
      // Organic liquid stretching
      const stretchFactor = Math.min(speed * 0.01, 0.3);
      const angle = Math.atan2(velocityY.current, velocityX.current);
      
      // Apply smooth following with GSAP
      gsap.to(cursor, {
        x: cursorX.current - 25, // Center the 50px cursor
        y: cursorY.current - 25,
        scaleX: 1 + stretchFactor,
        scaleY: 1 - stretchFactor * 0.3,
        rotation: angle * (180 / Math.PI),
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      // Damping
      velocityX.current *= 0.85;
      velocityY.current *= 0.85;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.3)',
        willChange: 'transform',
        transformOrigin: 'center center'
      }}
    />
  );
}
