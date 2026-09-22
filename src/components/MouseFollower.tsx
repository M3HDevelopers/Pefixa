import { useEffect, useRef } from 'react';

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Position tracking
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  
  // Spring physics
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const accelerationX = useRef(0);
  const accelerationY = useRef(0);
  
  // Velocity tracking for stretching
  const rawVelocityX = useRef(0);
  const rawVelocityY = useRef(0);
  const smoothVelocityX = useRef(0);
  const smoothVelocityY = useRef(0);
  
  // Spring parameters (ultra-soft)
  const STIFFNESS = 0.08;  // Very low tension for soft feel
  const DAMPING = 0.88;    // High damping for smooth settling
  const MASS = 1.0;        // Mass for physics calculation
  
  // Stretch parameters
  const MAX_STRETCH = 1.2;  // Maximum stretch factor
  const STRETCH_SENSITIVITY = 0.008;  // How quickly it stretches
  const SNAP_BACK_SPEED = 0.12;  // How fast it returns to circle
  
  // Wobble parameters
  const WOBBLE_INTENSITY = 0.03;
  const WOBBLE_FREQUENCY = 0.15;
  
  const rafId = useRef<number>(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate raw velocity BEFORE updating target
      const now = Date.now();
      const deltaTime = Math.max(now - lastTime.current, 1);
      
      rawVelocityX.current = (e.clientX - targetX.current) / deltaTime * 16;
      rawVelocityY.current = (e.clientY - targetY.current) / deltaTime * 16;
      
      // Then update target position
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      
      lastTime.current = now;
    };

    const animate = () => {
      if (!cursor) return;

      // Spring-mass-damper physics
      const dx = targetX.current - currentX.current;
      const dy = targetY.current - currentY.current;
      
      // Calculate spring force
      const forceX = dx * STIFFNESS;
      const forceY = dy * STIFFNESS;
      
      // Apply force to acceleration
      accelerationX.current = forceX / MASS;
      accelerationY.current = forceY / MASS;
      
      // Update velocity with damping
      velocityX.current = (velocityX.current + accelerationX.current) * DAMPING;
      velocityY.current = (velocityY.current + accelerationY.current) * DAMPING;
      
      // Update position
      currentX.current += velocityX.current;
      currentY.current += velocityY.current;
      
      // Smooth velocity for stretching (more aggressive smoothing)
      smoothVelocityX.current = smoothVelocityX.current * 0.85 + rawVelocityX.current * 0.15;
      smoothVelocityY.current = smoothVelocityY.current * 0.85 + rawVelocityY.current * 0.15;
      
      // Calculate speed for stretch
      const speed = Math.sqrt(
        smoothVelocityX.current ** 2 + smoothVelocityY.current ** 2
      );
      
      // Calculate stretch factor (velocity-based elongation)
      const stretchFactor = Math.min(speed * STRETCH_SENSITIVITY, MAX_STRETCH);
      
      // Calculate rotation angle (align with velocity direction)
      const angle = Math.atan2(smoothVelocityY.current, smoothVelocityX.current);
      const rotation = angle * (180 / Math.PI);
      
      // Add wobble effect when moving slowly (organic feel)
      const time = Date.now() * 0.001;
      const wobbleX = Math.sin(time * WOBBLE_FREQUENCY) * WOBBLE_INTENSITY;
      const wobbleY = Math.cos(time * WOBBLE_FREQUENCY * 1.3) * WOBBLE_INTENSITY;
      
      // Calculate final scale (stretch in direction of movement)
      const scaleX = 1 + stretchFactor + wobbleX;
      const scaleY = 1 - stretchFactor * 0.4 + wobbleY; // Compress perpendicular
      
      // Smooth snap-back when speed is low
      const snapBack = speed < 5 ? SNAP_BACK_SPEED : 1;
      const finalScaleX = 1 + (scaleX - 1) * snapBack;
      const finalScaleY = 1 + (scaleY - 1) * snapBack;
      
      // Apply transform with GPU acceleration
      cursor.style.transform = `translate3d(${currentX.current - 30}px, ${currentY.current - 30}px, 0) scale(${finalScaleX}, ${finalScaleY}) rotate(${rotation}deg)`;
      
      // Fade out when over cards (merge effect)
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
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#ffffff',
        willChange: 'transform, opacity',
        mixBlendMode: 'difference',
        transition: 'opacity 0.15s ease'
      }}
    />
  );
}
