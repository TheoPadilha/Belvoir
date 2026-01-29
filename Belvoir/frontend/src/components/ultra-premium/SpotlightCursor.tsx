import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const SpotlightCursor = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for fine pointer and reduced motion
    const hasFinPointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinPointer || prefersReducedMotion) return;

    setIsVisible(true);

    const spotlight = spotlightRef.current;
    const trail = trailRef.current;
    if (!spotlight || !trail) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Main spotlight follows mouse smoothly
      gsap.to(spotlight, {
        x: mousePos.current.x - 150,
        y: mousePos.current.y - 150,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Trail follows with more delay
      gsap.to(trail, {
        x: mousePos.current.x - 250,
        y: mousePos.current.y - 250,
        duration: 0.8,
        ease: 'power2.out',
      });

      requestAnimationFrame(animate);
    };

    // Handle hover states
    const handleLinkEnter = () => {
      gsap.to(spotlight, {
        scale: 1.5,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLinkLeave = () => {
      gsap.to(spotlight, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    // Add hover listeners to links and buttons
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleLinkEnter);
      el.addEventListener('mouseleave', handleLinkLeave);
    });

    // MutationObserver for dynamic elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll('a, button, [data-cursor-hover]');
      newElements.forEach((el) => {
        el.addEventListener('mouseenter', handleLinkEnter);
        el.addEventListener('mouseleave', handleLinkLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleLinkEnter);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer trail glow */}
      <div
        ref={trailRef}
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[9998]"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.08) 0%, transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Main spotlight */}
      <div
        ref={spotlightRef}
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[9999]"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.15) 0%, rgba(139, 92, 36, 0.05) 40%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
};

export default SpotlightCursor;
