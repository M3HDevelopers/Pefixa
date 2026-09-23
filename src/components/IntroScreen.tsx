import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Initial breathing animation
    const breathingTl = gsap.timeline({ repeat: -1 });
    
    breathingTl.to(glowRef.current, {
      scale: 1.1,
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut'
    })
    .to(glowRef.current, {
      scale: 1,
      opacity: 0.4,
      duration: 2,
      ease: 'sine.inOut'
    });

    // Subtle logo float
    gsap.to(logoRef.current, {
      y: -10,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Slow ring rotation
    gsap.to(ring1Ref.current, {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1
    });

    gsap.to(ring2Ref.current, {
      rotation: -360,
      duration: 30,
      ease: 'none',
      repeat: -1
    });

    gsap.to(ring3Ref.current, {
      rotation: 360,
      duration: 25,
      ease: 'none',
      repeat: -1
    });

    return () => {
      breathingTl.kill();
      gsap.killTweensOf([logoRef.current, ring1Ref.current, ring2Ref.current, ring3Ref.current, glowRef.current]);
    };
  }, []);

  const handleMouseEnter = () => {
    if (isTransitioning) return;
    setIsHovered(true);

    // Intensify glow on hover
    gsap.to(glowRef.current, {
      scale: 1.3,
      opacity: 0.8,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Speed up rings
    gsap.to([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Create particle burst
    createParticleBurst();
  };

  const handleMouseLeave = () => {
    if (isTransitioning) return;
    setIsHovered(false);

    // Reset glow
    gsap.to(glowRef.current, {
      scale: 1,
      opacity: 0.4,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Reset rings
    gsap.to([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const createParticleBurst = () => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.children;
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;

      gsap.fromTo(particle,
        {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0
        },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      gsap.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        delay: 0.3,
        ease: 'power2.in'
      });
    }
  };

  const handleClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Cinematic transition sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out intro and scroll to hero
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete();
            // Smooth scroll to hero section
            const heroSection = document.querySelector('[data-hero-section]');
            if (heroSection) {
              heroSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      }
    });

    // Phase 1: Logo spin and scale
    tl.to(logoRef.current, {
      rotation: 720,
      scale: 1.5,
      duration: 0.6,
      ease: 'power4.in'
    });

    // Phase 2: Rings explode outward
    tl.to([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
      scale: 3,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.05
    }, '-=0.3');

    // Phase 3: Glow flash
    tl.to(glowRef.current, {
      scale: 2,
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out'
    }, '-=0.2');

    // Phase 4: Logo shatter effect (scale down and fade)
    tl.to(logoRef.current, {
      scale: 0,
      opacity: 0,
      rotation: 1080,
      duration: 0.4,
      ease: 'power4.in'
    }, '-=0.1');

    // Phase 5: Glow fade
    tl.to(glowRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2');

    // Particle explosion
    createExplosion();
  };

  const createExplosion = () => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.children;
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 200 + Math.random() * 100;

      gsap.fromTo(particle,
        {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0
        },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 1,
          scale: 2,
          duration: 0.8,
          ease: 'power4.out'
        }
      );

      gsap.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        delay: 0.4,
        ease: 'power2.in'
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20" />

      {/* Ambient particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main logo container */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <div
          ref={glowRef}
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/40 blur-3xl opacity-40"
        />

        {/* Rotating rings */}
        <div
          ref={ring1Ref}
          className="absolute w-80 h-80 border border-white/10 rounded-full"
        />
        <div
          ref={ring2Ref}
          className="absolute w-64 h-64 border border-white/15 rounded-full"
        />
        <div
          ref={ring3Ref}
          className="absolute w-48 h-48 border border-white/20 rounded-full"
        />

        {/* Interactive particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px'
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div
          ref={logoRef}
          className="relative z-10 transition-transform"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src="/pefixa-logo.svg"
            alt="Pefixa"
            className="w-40 h-40 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/40 text-sm tracking-widest uppercase animate-pulse">
          Click to Enter
        </p>
      </div>
    </div>
  );
}
