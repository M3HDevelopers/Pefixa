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

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleCursorEnter = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail;
      
      setIsHovered(true);
      
      if (fillRef.current) {
        // Set the fill origin
        fillRef.current.style.left = `${x}%`;
        fillRef.current.style.top = `${y}%`;
        
        // Trigger water drop animation
        gsap.fromTo(fillRef.current, 
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 3,
            opacity: 1,
            duration: 0.8,
            ease: 'power4.out'
          }
        );
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (!card || !fillRef.current) return;
      
      setIsHovered(true);
      
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Set the fill origin
      fillRef.current.style.left = `${x}%`;
      fillRef.current.style.top = `${y}%`;
      
      // Trigger water drop animation
      gsap.fromTo(fillRef.current, 
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 3,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out'
        }
      );
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      
      if (fillRef.current) {
        gsap.to(fillRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      }
    };

    // Listen for custom cursor event
    card.addEventListener('cursor-enter', handleCursorEnter);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('cursor-enter', handleCursorEnter);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: isHovered 
          ? '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)' 
          : 'none'
      }}
    >
      {/* Liquid fill effect */}
      <div
        ref={fillRef}
        className="absolute pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Border glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
        }}
      />
    </div>
  );
}
