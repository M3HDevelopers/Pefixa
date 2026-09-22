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
  const isOverText = useRef(false);
  const isOverCard = useRef(false);

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

      // Check what element we're hovering
      const target = e.target as HTMLElement;
      const isText = target.matches('h1, h2, h3, h4, h5, h6, p, span, a, button');
      const isCard = target.closest('.liquid-card');

      // Update blend mode based on what we're hovering
      if (isText && !isCard) {
        if (!isOverText.current) {
          isOverText.current = true;
          isOverCard.current = false;
          cursor.style.mixBlendMode = 'difference';
          cursor.style.background = 'rgba(255, 255, 255, 0.8)';
        }
      } else if (isCard) {
        if (!isOverCard.current) {
          isOverCard.current = true;
          isOverText.current = false;
          cursor.style.mixBlendMode = 'normal';
          cursor.style.background = 'rgba(255, 255, 255, 0.4)';
          cursor.style.transform = 'scale(1.5)';
          
          // Trigger water drop effect on the card
          const card = isCard as HTMLElement;
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          // Dispatch custom event for the card to handle
          card.dispatchEvent(new CustomEvent('cursor-enter', {
            detail: { x, y, clientX: e.clientX, clientY: e.clientY }
          }));
        }
      } else {
        if (isOverText.current || isOverCard.current) {
          isOverText.current = false;
          isOverCard.current = false;
          cursor.style.mixBlendMode = 'normal';
          cursor.style.background = 'rgba(255, 255, 255, 0.3)';
          cursor.style.transform = 'scale(1)';
        }
      }
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
        scaleX: (1 + stretchFactor) * (isOverCard.current ? 1.5 : 1),
        scaleY: (1 - stretchFactor * 0.3) * (isOverCard.current ? 1.5 : 1),
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
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-200"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.3)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)',
        willChange: 'transform',
        transformOrigin: 'center center'
      }}
    />
  );
}
