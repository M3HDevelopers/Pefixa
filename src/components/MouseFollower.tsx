import { useEffect, useRef } from 'react';

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  // Position tracking
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  
  // Spring physics
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  
  // Smooth velocity for morphing
  const smoothVelocityX = useRef(0);
  const smoothVelocityY = useRef(0);
  
  // Morphing state
  const currentMorph = useRef(0); // Current morph intensity
  const wobblePhase = useRef(0);
  const wobbleIntensity = useRef(0);
  
  // Physics parameters (ultra-soft)
  const STIFFNESS = 0.06;
  const DAMPING = 0.87;
  
  // Morph parameters
  const MORPH_SENSITIVITY = 0.025;
  const MAX_MORPH = 2.5; // Max stretch multiplier
  const MORPH_LERP = 0.12;
  const MORPH_DECAY = 0.88;
  
  // Shape parameters
  const NUM_POINTS = 24;
  const BASE_RADIUS = 32;
  
  const rafId = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      const prevTargetX = targetX.current;
      const prevTargetY = targetY.current;
      
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      
      // Calculate velocity
      const rawVelX = e.clientX - prevTargetX;
      const rawVelY = e.clientY - prevTargetY;
      
      // Smooth velocity
      smoothVelocityX.current = smoothVelocityX.current * 0.8 + rawVelX * 0.2;
      smoothVelocityY.current = smoothVelocityY.current * 0.8 + rawVelY * 0.2;
    };

    const generateShape = (speed: number, angle: number, morphIntensity: number, wobble: number): string => {
      const points: Array<[number, number]> = [];
      
      // Calculate stretch factors
      const stretchAmount = Math.min(morphIntensity * speed * MORPH_SENSITIVITY, MAX_MORPH);
      const stretchFront = 1 + stretchAmount; // Front stretches more
      const stretchBack = 1 - stretchAmount * 0.3; // Back compresses
      const stretchSide = 1 - stretchAmount * 0.5; // Sides compress
      
      for (let i = 0; i < NUM_POINTS; i++) {
        const t = i / NUM_POINTS;
        const baseAngle = t * Math.PI * 2;
        
        // Rotate angle to align with movement direction
        const relativeAngle = baseAngle - angle;
        
        // Calculate radius based on position relative to movement direction
        let radius = BASE_RADIUS;
        const cosAngle = Math.cos(relativeAngle);
        const sinAngle = Math.sin(relativeAngle);
        
        // Front of shape (direction of movement) - stretch more
        if (cosAngle > 0) {
          radius *= stretchFront * (0.5 + cosAngle * 0.5);
          radius += (1 - Math.abs(sinAngle)) * stretchAmount * BASE_RADIUS * 0.3;
        }
        // Back of shape - compress
        else {
          radius *= stretchBack;
        }
        
        // Sides - compress perpendicular to movement
        radius *= 1 - Math.abs(sinAngle) * stretchAmount * 0.3;
        
        // Add teardrop point at front
        if (cosAngle > 0.7 && morphIntensity > 0.3) {
          const pointiness = (cosAngle - 0.7) / 0.3;
          radius += pointiness * morphIntensity * BASE_RADIUS * 0.4;
        }
        
        // Add organic wobble
        const wobbleOffset = Math.sin(wobblePhase.current + i * 1.5) * wobble * BASE_RADIUS * 0.08;
        radius += wobbleOffset;
        
        // Convert to cartesian
        const x = Math.cos(baseAngle) * radius;
        const y = Math.sin(baseAngle) * radius;
        
        points.push([x, y]);
      }
      
      // Generate smooth closed path using cubic beziers
      return generateSmoothPath(points);
    };

    const generateSmoothPath = (points: Array<[number, number]>): string => {
      if (points.length < 3) return '';
      
      let path = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
      
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];
        
        // Catmull-Rom to Bezier conversion for smooth curves
        const tension = 0.5;
        const cp1x = p1[0] + (p2[0] - p0[0]) * tension / 3;
        const cp1y = p1[1] + (p2[1] - p0[1]) * tension / 3;
        const cp2x = p2[0] - (p3[0] - p1[0]) * tension / 3;
        const cp2y = p2[1] - (p3[1] - p1[1]) * tension / 3;
        
        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
      }
      
      path += ' Z';
      return path;
    };

    const animate = () => {
      if (!cursor || !pathRef.current) return;

      // Spring physics for position
      const dx = targetX.current - currentX.current;
      const dy = targetY.current - currentY.current;
      
      const forceX = dx * STIFFNESS;
      const forceY = dy * STIFFNESS;
      
      velocityX.current = (velocityX.current + forceX) * DAMPING;
      velocityY.current = (velocityY.current + forceY) * DAMPING;
      
      currentX.current += velocityX.current;
      currentY.current += velocityY.current;
      
      // Calculate speed
      const speed = Math.sqrt(
        smoothVelocityX.current ** 2 + smoothVelocityY.current ** 2
      );
      
      // Calculate movement angle
      const angle = speed > 0.5 
        ? Math.atan2(smoothVelocityY.current, smoothVelocityX.current)
        : 0;
      
      // Update morph intensity
      const targetMorph = Math.min(speed * MORPH_SENSITIVITY, 1);
      currentMorph.current += (targetMorph - currentMorph.current) * MORPH_LERP;
      
      // Decay morph when slow
      if (speed < 1) {
        currentMorph.current *= MORPH_DECAY;
        
        // Trigger wobble when stopping
        if (speed < 0.5 && currentMorph.current > 0.1) {
          wobbleIntensity.current = Math.min(wobbleIntensity.current + 0.3, 1);
        }
      }
      
      // Update wobble
      if (wobbleIntensity.current > 0.01) {
        wobblePhase.current += 0.3;
        wobbleIntensity.current *= 0.92;
      }
      
      // Generate morphed shape
      const pathData = generateShape(
        speed,
        angle,
        currentMorph.current,
        wobbleIntensity.current
      );
      
      pathRef.current.setAttribute('d', pathData);
      
      // Apply position transform
      cursor.style.transform = `translate3d(${currentX.current - BASE_RADIUS}px, ${currentY.current - BASE_RADIUS}px, 0)`;
      
      // Fade out when over cards
      const element = document.elementFromPoint(targetX.current, targetY.current);
      const isOverCard = element?.closest('.liquid-card');
      cursor.style.opacity = isOverCard ? '0' : '1';

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: `${BASE_RADIUS * 2.5}px`,
        height: `${BASE_RADIUS * 2.5}px`,
        willChange: 'transform, opacity',
        mixBlendMode: 'difference',
        transition: 'opacity 0.15s ease'
      }}
    >
      <svg
        ref={svgRef}
        width={BASE_RADIUS * 2.5}
        height={BASE_RADIUS * 2.5}
        viewBox={`-${BASE_RADIUS * 1.25} -${BASE_RADIUS * 1.25} ${BASE_RADIUS * 2.5} ${BASE_RADIUS * 2.5}`}
        style={{ overflow: 'visible' }}
      >
        <path
          ref={pathRef}
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}
