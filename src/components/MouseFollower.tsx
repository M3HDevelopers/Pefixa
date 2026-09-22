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
      const interactive = target.closest('.liquid-card, button, a');
      
      // Magnetic pull effect
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = centerX - e.clientX;
        const distY = centerY - e.clientY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = 120;
        
        if (distance < maxDistance) {
          const pullStrength = (1 - distance / maxDistance) * 0.3;
          cursorX.current += distX * pullStrength;
          cursorY.current += distY * pullStrength;
          
          // Elongate towards element
          const angle = Math.atan2(distY, distX);
          targetScale.current = {
            x: 1 + pullStrength * 0.6,
            y: 1 + pullStrength * 0.2
          };
          targetRotation.current = angle * (180 / Math.PI);
        }
      } else {
        targetScale.current = { x: 1, y: 1 };
        targetRotation.current = 0;
      }
    };

    const animate = () => {
      if (!cursor) return;

      // Calculate stretch based on velocity (liquid deformation)
      const speed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
      
      // Organic liquid stretching
      const stretchFactor = Math.min(speed * 0.015, 0.5);
      const angle = Math.atan2(velocityY.current, velocityX.current);
      
      // Add wobble for liquid feel
      const wobble = Math.sin(Date.now() * 0.01) * 0.03;
      
      if (targetScale.current.x === 1 && targetScale.current.y === 1) {
        targetScale.current = {
          x: 1 + stretchFactor + wobble,
          y: 1 - stretchFactor * 0.4 + wobble
        };
        targetRotation.current = angle * (180 / Math.PI);
      }

      // Spring physics with damping
      const springStrength = 0.15;
      const damping = 0.85;
      
      currentScale.current.x += (targetScale.current.x - currentScale.current.x) * springStrength;
      currentScale.current.y += (targetScale.current.y - currentScale.current.y) * springStrength;
      currentRotation.current += (targetRotation.current - currentRotation.current) * springStrength;
      
      velocityX.current *= damping;
      velocityY.current *= damping;

      // Reset rotation when slow
      if (speed < 1) {
        targetRotation.current *= 0.9;
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
    <>
      {/* SVG Filter for Gooey/Metaball Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="liquid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="liquid" />
            <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Cursor - Liquid Droplet */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: '80px',
          height: '80px',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          filter: 'url(#liquid)',
          mixBlendMode: 'screen'
        }}
      >
        {/* Main liquid body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: `
              0 0 60px rgba(255, 255, 255, 0.3),
              0 0 100px rgba(255, 255, 255, 0.15),
              inset 0 0 30px rgba(255, 255, 255, 0.2),
              inset 0 -10px 20px rgba(255, 255, 255, 0.1)
            `,
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}
        />
        
        {/* Highlight for 3D liquid effect */}
        <div
          className="absolute rounded-full"
          style={{
            top: '15%',
            left: '20%',
            width: '30%',
            height: '30%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
            filter: 'blur(4px)'
          }}
        />
      </div>
    </>
  );
}
