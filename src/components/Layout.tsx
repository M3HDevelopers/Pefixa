import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { useEffect, useRef, useState } from 'react';

// Global Mouse Follower - Water Drop Effect
function GlobalMouseFollower() {
  const blobRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [data-hover="text"], [data-hover="fill"]');
      
      if (isInteractive) {
        const hoverType = isInteractive.getAttribute('data-hover') || 
                         (isInteractive.tagName === 'A' || isInteractive.tagName === 'BUTTON' ? 'fill' : 'text');
        setHoverTarget(hoverType);
        setIsHovering(true);
      } else {
        setIsHovering(false);
        setHoverTarget(null);
      }
      
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (blobRef.current) {
        // Calculate velocity for morphing effect
        velocity.current.x = pos.current.x - lastPos.current.x;
        velocity.current.y = pos.current.y - lastPos.current.y;
        lastPos.current = { x: pos.current.x, y: pos.current.y };

        // Smooth follow with spring physics
        blobRef.current.style.left = `${pos.current.x}px`;
        blobRef.current.style.top = `${pos.current.y}px`;
        
        // Morph based on velocity (water drop effect)
        const speedMagnitude = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        const stretch = Math.min(speedMagnitude * 0.02, 0.3);
        const angle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);
        
        if (isHovering && hoverTarget === 'fill') {
          blobRef.current.style.transform = `translate(-50%, -50%) scale(2.5)`;
          blobRef.current.style.opacity = '0.15';
        } else {
          blobRef.current.style.transform = `translate(-50%, -50%) scale(${1 + stretch}, ${1 - stretch * 0.5}) rotate(${angle}deg)`;
          blobRef.current.style.opacity = '0.3';
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovering, hoverTarget]);

  return (
    <div
      ref={blobRef}
      className="pointer-events-none fixed top-0 left-0 w-20 h-20 rounded-full z-[1] hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        filter: 'blur(8px)',
        willChange: 'transform, left, top, opacity',
        transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
        mixBlendMode: 'screen',
      }}
    />
  );
}

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <GlobalMouseFollower />
      <TopNav />
      <main className="pt-14 page-enter" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
