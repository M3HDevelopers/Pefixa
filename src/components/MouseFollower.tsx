import { useEffect, useRef } from 'react';

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const currentScaleX = useRef(1);
  const currentScaleY = useRef(1);
  const currentRotation = useRef(0);
  const isOverCard = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Instant position update - no lag
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;

      // Calculate velocity for liquid stretching
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      
      // Faster velocity response (less smoothing = more responsive)
      velocityX.current = velocityX.current * 0.5 + dx * 0.5;
      velocityY.current = velocityY.current * 0.5 + dy * 0.5;
      
      lastX.current = e.clientX;
      lastY.current = e.clientY;

      // Check if over card
      const target = e.target as HTMLElement;
      const card = target.closest('.liquid-card');
      isOverCard.current = !!card;
    };

    const animate = () => {
      if (!cursor) return;

      const speed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
      
      // Liquid stretching - more responsive
      const stretch = Math.min(speed * 0.02, 0.5);
      const angle = Math.atan2(velocityY.current, velocityX.current);
      
      // Target scale based on state
      const targetScaleX = isOverCard.current ? 0 : (1 + stretch);
      const targetScaleY = isOverCard.current ? 0 : (1 - stretch * 0.4);
      const targetRotation = isOverCard.current ? 0 : angle * (180 / Math.PI);
      
      // Fast spring back (high stiffness = instant snap)
      const stiffness = 0.3; // Higher = faster response
      const damping = 0.7;   // Lower = less sluggish
      
      currentScaleX.current += (targetScaleX - currentScaleX.current) * stiffness;
      currentScaleY.current += (targetScaleY - currentScaleY.current) * stiffness;
      currentRotation.current += (targetRotation - currentRotation.current) * stiffness;
      
      // Velocity damping - faster decay for quick snap-back
      velocityX.current *= damping;
      velocityY.current *= damping;
      
      // Kill tiny velocities to prevent jitter
      if (Math.abs(velocityX.current) < 0.1) velocityX.current = 0;
      if (Math.abs(velocityY.current) < 0.1) velocityY.current = 0;

      // Direct transform update - NO GSAP delay, instant positioning
      cursor.style.transform = `translate3d(${cursorX.current - 25}px, ${cursorY.current - 25}px, 0) scale(${currentScaleX.current}, ${currentScaleY.current}) rotate(${currentRotation.current}deg)`;
      
      // Opacity based on card hover (merge effect)
      cursor.style.opacity = isOverCard.current ? '0' : '1';

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
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
        background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.1) 100%)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.15), 0 0 40px rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        willChange: 'transform, opacity',
        mixBlendMode: 'difference',
        transition: 'opacity 0.15s ease'
      }}
    />
  );
}
