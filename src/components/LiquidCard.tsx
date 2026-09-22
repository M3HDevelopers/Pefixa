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
      
      // Kill any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Set fill origin
      fillRef.current.style.left = `${x}%`;
      fillRef.current.style.top = `${y}%`;
      
      // Water drop fill animation - more visible
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
        isolation: 'isolate', // Creates stacking context for blend modes
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered 
          ? '0 0 40px rgba(255, 255, 255, 0.12), inset 0 0 30px rgba(255, 255, 255, 0.06)' 
          : 'none'
      }}
    >
      {/* Liquid fill effect - more visible */}
      <div
        ref={fillRef}
        className="absolute pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 40%, rgba(255, 255, 255, 0.05) 70%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Content with proper z-index for blend mode */}
      <div 
        className="relative z-10"
        style={{
          mixBlendMode: 'normal' // Content stays normal, cursor inverts
        }}
      >
        {children}
      </div>
      
      {/* Border glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.08)'
        }}
      />
    </div>
  );
}
