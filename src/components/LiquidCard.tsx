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

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !fillRef.current) return;
    
    setIsHovered(true);
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Animate fill from entry point
    gsap.fromTo(fillRef.current, 
      {
        scale: 0,
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        opacity: 0
      },
      {
        scale: 3,
        opacity: 1,
        duration: 0.6,
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
      duration: 0.4,
      ease: 'power2.in'
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
        transition: 'background 0.3s ease'
      }}
    >
      {/* Liquid fill effect */}
      <div
        ref={fillRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Content */}
      <div 
        className="relative z-10"
        style={{
          color: isHovered ? '#000000' : '#ffffff',
          transition: 'color 0.3s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
}
