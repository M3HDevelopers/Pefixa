import { useRef, useState, ReactNode } from 'react';
import gsap from 'gsap';

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
}

export function LiquidCard({ children, className = '' }: LiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [fillOrigin, setFillOrigin] = useState({ x: 50, y: 50 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !fillRef.current) return;
    
    setIsHovered(true);
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFillOrigin({ x, y });
    
    // Animate fill from entry point with water splash effect
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
    if (!fillRef.current) return;
    
    setIsHovered(false);
    
    gsap.to(fillRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: isHovered ? '#ffffff' : '#0a0a0a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: isHovered ? '0 0 40px rgba(255, 255, 255, 0.15)' : 'none'
      }}
    >
      {/* Liquid fill effect - hidden by default */}
      <div
        ref={fillRef}
        className="absolute pointer-events-none"
        style={{
          left: `${fillOrigin.x}%`,
          top: `${fillOrigin.y}%`,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.9) 50%, transparent 100%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Content with adaptive colors */}
      <div 
        className={`relative z-10 ${isHovered ? 'liquid-card-hovered' : 'liquid-card-content'}`}
        style={{
          color: isHovered ? '#000000' : '#ffffff',
          transition: 'color 0.4s ease'
        }}
      >
        {children}
        
        {/* Special handling for inputs and interactive elements */}
        <style>{`
          .liquid-card-hovered input,
          .liquid-card-hovered textarea,
          .liquid-card-hovered select {
            background: rgba(0, 0, 0, 0.08) !important;
            color: #000000 !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
          }
          
          .liquid-card-hovered input::placeholder,
          .liquid-card-hovered textarea::placeholder {
            color: rgba(0, 0, 0, 0.5) !important;
          }
          
          .liquid-card-content input,
          .liquid-card-content textarea,
          .liquid-card-content select {
            background: rgba(255, 255, 255, 0.05) !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
          }
          
          .liquid-card-content input::placeholder,
          .liquid-card-content textarea::placeholder {
            color: rgba(255, 255, 255, 0.4) !important;
          }
          
          .liquid-card-hovered svg,
          .liquid-card-content svg {
            transition: color 0.4s ease;
          }
          
          .liquid-card-hovered .icon-box {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
          }
          
          .liquid-card-content .icon-box {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
        `}</style>
      </div>
      
      {/* Border glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
        }}
      />
    </div>
  );
}
