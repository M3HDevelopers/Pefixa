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
  const currentMorph = useRef(0);
  const wobblePhase = useRef(0);
  const wobbleIntensity = useRef(0);
  
  // Physics parameters
  const STIFFNESS = 0.18;
  const DAMPING = 0.80;
  
  // Morph parameters
  const MORPH_SENSITIVITY = 0.010;
  const MAX_MORPH = 1.3;
  const MORPH_LERP = 0.10;
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
      
      const rawVelX = e.clientX - prevTargetX;
      const rawVelY = e.clientY - prevTargetY;
      
      smoothVelocityX.current = smoothVelocityX.current * 0.8 + rawVelX * 0.2;
      smoothVelocityY.current = smoothVelocityY.current * 0.8 + rawVelY * 0.2;
    };

    const generateShape = (speed: number, angle: number, morphIntensity: number, wobble: number): string => {
      const points: Array<[number, number]> = [];
      
      if (morphIntensity < 0.01 && wobble < 0.01) {
        for (let i = 0; i < NUM_POINTS; i++) {
          const baseAngle = (i / NUM_POINTS) * Math.PI * 2;
          points.push([
            Math.cos(baseAngle) * BASE_RADIUS,
            Math.sin(baseAngle) * BASE_RADIUS
          ]);
        }
        return generateSmoothPath(points);
      }
      
      const stretchAmount = Math.min(morphIntensity * speed * MORPH_SENSITIVITY, MAX_MORPH);
      
      for (let i = 0; i < NUM_POINTS; i++) {
        const t = i / NUM_POINTS;
        const baseAngle = t * Math.PI * 2;
        const relativeAngle = baseAngle - angle;
        
        let radius = BASE_RADIUS;
        const cosAngle = Math.cos(relativeAngle);
        const sinAngle = Math.sin(relativeAngle);
        
        if (stretchAmount > 0.01) {
          if (cosAngle > 0) {
            radius *= 1 + stretchAmount * cosAngle;
          } else {
            radius *= 1 - stretchAmount * 0.3 * Math.abs(cosAngle);
          }
          
          radius *= 1 - stretchAmount * 0.4 * Math.abs(sinAngle);
          
          if (cosAngle > 0.7 && morphIntensity > 0.3) {
            const pointiness = (cosAngle - 0.7) / 0.3;
            radius += pointiness * morphIntensity * BASE_RADIUS * 0.15;
          }
        }
        
        if (wobble > 0.01) {
          const wobbleOffset = Math.sin(wobblePhase.current + i * 1.5) * wobble * BASE_RADIUS * 0.02;
          radius += wobbleOffset;
        }
        
        const x = Math.cos(baseAngle) * radius;
        const y = Math.sin(baseAngle) * radius;
        
        points.push([x, y]);
      }
      
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

      const dx = targetX.current - currentX.current;
      const dy = targetY.current - currentY.current;
      
      const forceX = dx * STIFFNESS;
      const forceY = dy * STIFFNESS;
      
      velocityX.current = (velocityX.current + forceX) * DAMPING;
      velocityY.current = (velocityY.current + forceY) * DAMPING;
      
      currentX.current += velocityX.current;
      currentY.current += velocityY.current;
      
      const speed = Math.sqrt(
        smoothVelocityX.current ** 2 + smoothVelocityY.current ** 2
      );
      
      const angle = speed > 0.5 
        ? Math.atan2(smoothVelocityY.current, smoothVelocityX.current)
        : 0;
      
      const targetMorph = Math.min(speed * MORPH_SENSITIVITY, 1);
      currentMorph.current += (targetMorph - currentMorph.current) * MORPH_LERP;
      
      if (speed < 2) {
        currentMorph.current *= MORPH_DECAY;
      }
      
      if (speed < 0.3 && currentMorph.current > 0.3) {
        wobbleIntensity.current = Math.min(wobbleIntensity.current + 0.1, 0.3);
      }
      
      if (wobbleIntensity.current > 0.01) {
        wobblePhase.current += 0.15;
        wobbleIntensity.current *= 0.96;
      } else {
        wobbleIntensity.current = 0;
      }
      
      const pathData = generateShape(
        speed,
        angle,
        currentMorph.current,
        wobbleIntensity.current
      );
      
      pathRef.current.setAttribute('d', pathData);
      
      cursor.style.transform = `translate3d(${currentX.current - BASE_RADIUS}px, ${currentY.current - BASE_RADIUS}px, 0)`;
      
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
