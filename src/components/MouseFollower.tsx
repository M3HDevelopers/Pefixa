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
  const targetScale = useRef({ x: 1, y: 1 });
  const currentScale = useRef({ x: 1, y: 1 });
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const isHovering = useRef(false);

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

      // Check for interactive elements
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, input, textarea, [data-interactive]');
      
      if (interactive) {
        isHovering.current = true;
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Magnetic pull effect
        const distX = centerX - e.clientX;
        const distY = centerY - e.clientY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
          const pullStrength = (1 - distance / maxDistance) * 0.3;
          cursorX.current += distX * pullStrength;
          cursorY.current += distY * pullStrength;
          
          targetScale.current = {
            x: 1 + pullStrength * 0.5,
            y: 1 + pullStrength * 0.5
          };
        }
      } else {
        isHovering.current = false;
        targetScale.current = { x: 1, y: 1 };
      }
    };

    const animate = () => {
      if (!cursor) return;

      // Calculate stretch based on velocity
      const speed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
      
      if (!isHovering.current) {
        const stretchFactor = Math.min(speed * 0.015, 0.4);
        const angle = Math.atan2(velocityY.current, velocityX.current);
        
        targetScale.current = {
          x: 1 + stretchFactor,
          y: 1 - stretchFactor * 0.5
        };
        
        targetRotation.current = angle * (180 / Math.PI);
      }

      // Spring physics
      const springStrength = 0.15;
      const damping = 0.8;
      
      currentScale.current.x += (targetScale.current.x - currentScale.current.x) * springStrength;
      currentScale.current.y += (targetScale.current.y - currentScale.current.y) * springStrength;
      currentRotation.current += (targetRotation.current - currentRotation.current) * springStrength;
      
      velocityX.current *= damping;
      velocityY.current *= damping;

      if (speed < 2) {
        targetRotation.current = 0;
      }

      gsap.set(cursor, {
        x: cursorX.current,
        y: cursorY.current,
        scaleX: currentScale.current.x,
        scaleY: currentScale.current.y,
        rotation: currentRotation.current,
        transformOrigin: 'center center'
      });

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
      className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[9999]"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        willChange: 'transform',
        mixBlendMode: 'screen'
      }}
    />
  );
}
