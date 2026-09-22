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
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !fillRef.current) return;
    
    setIsHovered(true);
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFillOrigin({ x, y });
    
    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }
    
    // Animate fill from entry point with water splash effect
    animationRef.current = gsap.fromTo(fillRef.current, 
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
    
    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }
    
    // Immediately reverse the animation
    animationRef.current = gsap.to(fillRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        // Ensure fill is completely hidden
        if (fillRef.current) {
          gsap.set(fillRef.current, { scale: 0, opacity: 0 });
        }
      }
    });
  };

  // Handle mouse out for child elements
  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as Node;
    if (!cardRef.current || !relatedTarget) return;
    
    // If mouse is leaving the card completely
    if (!cardRef.current.contains(relatedTarget)) {
      handleMouseLeave();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseOut={handleMouseOut}
      style={{
        background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: isHovered 
          ? '0 0 30px rgba(255, 255, 255, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.03)' 
          : 'none'
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
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
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
          color: isHovered ? '#ffffff' : '#ffffff',
          transition: 'color 0.4s ease'
        }}
      >
        {children}
        
        {/* Adaptive styling for inputs and interactive elements */}
        <style>{`
          .liquid-card-hovered input,
          .liquid-card-hovered textarea,
          .liquid-card-hovered select {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(8px);
          }
          
          .liquid-card-hovered input::placeholder,
          .liquid-card-hovered textarea::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }
          
          .liquid-card-content input,
          .liquid-card-content textarea,
          .liquid-card-content select {
            background: rgba(255, 255, 255, 0.05) !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          
          .liquid-card-content input::placeholder,
          .liquid-card-content textarea::placeholder {
            color: rgba(255, 255, 255, 0.4) !important;
          }
          
          .liquid-card-hovered .icon-box {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
          }
          
          .liquid-card-content .icon-box {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          
          .liquid-card-hovered svg,
          .liquid-card-content svg {
            color: #ffffff !important;
            transition: color 0.4s ease;
          }
        `}</style>
      </div>
      
      {/* Border glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.05)'
        }}
      />
    </div>
  );
}
