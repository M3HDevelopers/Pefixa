import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
}

export function LiquidCard({ children, className = '' }: LiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = (e: MouseEvent) => {
      if (!card || !fillRef.current) return;
      
      setIsHovered(true);
      
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      fillRef.current.style.left = `${x}%`;
      fillRef.current.style.top = `${y}%`;
      
      animationRef.current = gsap.fromTo(fillRef.current, 
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 3,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out'
        }
      );
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      
      if (fillRef.current) {
        if (animationRef.current) {
          animationRef.current.kill();
        }
        
        animationRef.current = gsap.to(fillRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            if (fillRef.current) {
              gsap.set(fillRef.current, { scale: 0, opacity: 0 });
            }
          }
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as Node;
      if (!card || !relatedTarget) return;
      
      if (!card.contains(relatedTarget)) {
        handleMouseLeave();
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseout', handleMouseOut);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`liquid-card relative overflow-hidden ${className}`}
      style={{
        isolation: 'isolate',
        background: isHovered ? '#1a1a1a' : '#0a0a0a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
        borderRadius: '8px',
      }}
    >
      <div
        ref={fillRef}
        className="absolute pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
