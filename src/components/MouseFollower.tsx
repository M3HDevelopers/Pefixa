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
      
      // Calculate velocity
      velocityX.current = e.clientX - lastX.current;
      velocityY.current = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    const animate = () => {
      // Calculate stretch based on velocity
      const speed = Math.sqrt(velocityX.current ** 2 + velocityY.current ** 2);
      const stretchX = 1 + Math.min(speed * 0.02, 0.5);
      const stretchY = 1 / stretchX;
      const rotation = Math.atan2(velocityY.current, velocityX.current) * (180 / Math.PI);

      // Smooth follow with GSAP
      gsap.to(cursor, {
        x: cursorX.current,
        y: cursorY.current,
        scaleX: stretchX,
        scaleY: stretchY,
        rotation: rotation,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
        willChange: 'transform'
      }}
    />
  );
}
