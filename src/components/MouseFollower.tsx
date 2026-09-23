import { useEffect, useRef } from 'react';

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const animate = () => {
      // Simple lerp for smooth following
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

      cursor.style.transform = `translate3d(${posRef.current.x - 12}px, ${posRef.current.y - 12}px, 0)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(4px)',
        willChange: 'transform',
        mixBlendMode: 'difference',
      }}
    />
  );
}
