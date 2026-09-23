import { useRef, useState, ReactNode } from 'react';

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
}

export function LiquidCard({ children, className = '' }: LiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
        borderRadius: '8px',
      }}
    >
      {/* Simple background change on hover - NO complex animations */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
