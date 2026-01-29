import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalTextProps {
  text?: string;
  speed?: number;
  direction?: 'left' | 'right';
}

export const HorizontalText = ({
  text = 'COLEÇÃO PREMIUM • ELEGÂNCIA ATEMPORAL • DESIGN EXCLUSIVO • TRADIÇÃO SUÍÇA •',
  speed = 1,
  direction = 'left',
}: HorizontalTextProps) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const textEl = textRef.current;
    const text2El = text2Ref.current;

    if (!wrapper || !textEl || !text2El) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Calculate text width for seamless loop
    const textWidth = textEl.offsetWidth;

    // Set initial positions
    gsap.set(text2El, { x: textWidth });

    // Create infinite loop animation
    const directionMultiplier = direction === 'left' ? -1 : 1;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to([textEl, text2El], {
      x: `+=${directionMultiplier * textWidth}`,
      duration: 30 / speed,
      ease: 'none',
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x);
          if (direction === 'left') {
            return val < -textWidth ? val + textWidth * 2 : val;
          } else {
            return val > textWidth ? val - textWidth * 2 : val;
          }
        }),
      },
    });

    // Scroll-triggered horizontal movement (parallax)
    const scrollTween = gsap.to([textEl, text2El], {
      x: direction === 'left' ? '-=200' : '+=200',
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      tl.kill();
      scrollTween.scrollTrigger?.kill();
    };
  }, [text, speed, direction]);

  return (
    <section
      ref={wrapperRef}
      className="relative py-16 md:py-24 bg-charcoal overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-secondary-900 to-charcoal opacity-50" />

      {/* Text container */}
      <div className="relative flex items-center whitespace-nowrap">
        <div
          ref={textRef}
          className="flex-shrink-0 text-[12vw] md:text-[10vw] lg:text-[8vw] font-display text-primary-500/30 tracking-tight"
          style={{
            WebkitTextStroke: '2px rgba(184, 115, 51, 0.6)',
          }}
        >
          {text}
        </div>
        <div
          ref={text2Ref}
          className="flex-shrink-0 text-[12vw] md:text-[10vw] lg:text-[8vw] font-display text-primary-500/30 tracking-tight absolute"
          style={{
            WebkitTextStroke: '2px rgba(184, 115, 51, 0.6)',
          }}
        >
          {text}
        </div>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />
    </section>
  );
};

// Alternate version with filled text
export const HorizontalTextFilled = ({
  text = 'BELVOIR • RELÓGIOS DE LUXO • DESDE 1987 •',
  speed = 0.8,
}: HorizontalTextProps) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;

    if (!wrapper || !track1 || !track2) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Continuous animation - track 1 goes left, track 2 goes right
    const tl1 = gsap.to(track1, {
      xPercent: -50,
      duration: 40 / speed,
      ease: 'none',
      repeat: -1,
    });

    const tl2 = gsap.to(track2, {
      xPercent: 50,
      duration: 40 / speed,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tl1.kill();
      tl2.kill();
    };
  }, [speed]);

  const repeatedText = `${text} `.repeat(6);

  return (
    <section
      ref={wrapperRef}
      className="relative py-8 bg-cream overflow-hidden"
    >
      {/* Track 1 - moves left */}
      <div className="overflow-hidden mb-4">
        <div
          ref={track1Ref}
          className="flex whitespace-nowrap"
          style={{ width: '200%' }}
        >
          <span className="text-4xl md:text-5xl lg:text-6xl font-display text-charcoal/10 tracking-wider">
            {repeatedText}
          </span>
          <span className="text-4xl md:text-5xl lg:text-6xl font-display text-charcoal/10 tracking-wider">
            {repeatedText}
          </span>
        </div>
      </div>

      {/* Track 2 - moves right */}
      <div className="overflow-hidden">
        <div
          ref={track2Ref}
          className="flex whitespace-nowrap"
          style={{ width: '200%', transform: 'translateX(-50%)' }}
        >
          <span className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-500/20 tracking-wider">
            {repeatedText}
          </span>
          <span className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-500/20 tracking-wider">
            {repeatedText}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HorizontalText;
