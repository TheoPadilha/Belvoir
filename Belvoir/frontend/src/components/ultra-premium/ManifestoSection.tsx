import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

interface ManifestoSectionProps {
  text?: string;
}

export const ManifestoSection = ({
  text = 'Nós não fazemos relógios. Criamos legados. Esculpimos o tempo. Desenhamos eternidade. Cada peça é uma obra de arte que transcende gerações.',
}: ManifestoSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Start visible by default

  useEffect(() => {
    const section = sectionRef.current;
    const textElement = textRef.current;
    if (!section || !textElement) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Split text into words
    const split = new SplitType(textElement, { types: 'words' });

    if (!split.words) return;

    // Fallback timeout to ensure visibility
    const fallbackTimeout = setTimeout(() => {
      if (split.words) {
        split.words.forEach((word) => {
          if (window.getComputedStyle(word).opacity === '0') {
            gsap.set(word, { opacity: 1, y: 0 });
          }
        });
      }
    }, 3000);

    // Animate each word with stagger
    split.words.forEach((word, index) => {
      const randomScale = gsap.utils.random(0.95, 1.1);

      // Use fromTo for reliable animation
      gsap.fromTo(word,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scale: randomScale,
          duration: 0.5,
          delay: index * 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Hover effects
      const handleMouseEnter = () => {
        gsap.to(word, {
          scale: randomScale * 1.15,
          color: '#b87333',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(word, {
          scale: randomScale,
          color: '#ffffff',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      word.style.cursor = 'default';
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      clearTimeout(fallbackTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      split.revert();
    };
  }, [text]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-24 bg-charcoal overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-40 animate-pulse"
          style={{
            background: 'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(184, 115, 51, 0.2) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 70% 50%, rgba(139, 92, 36, 0.15) 0%, transparent 70%)',
            animationDuration: '8s',
          }}
        />
        <div className="absolute inset-0 noise-overlay opacity-20" />
      </div>

      <div className="container-custom relative px-4">
        <p
          ref={textRef}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display text-white text-center leading-tight md:leading-tight lg:leading-tight"
          style={{ wordSpacing: '0.2em' }}
        >
          {text}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-8 w-32 h-[1px] bg-gradient-to-r from-primary-500/30 to-transparent" />
      <div className="absolute bottom-1/4 right-8 w-32 h-[1px] bg-gradient-to-l from-primary-500/30 to-transparent" />
    </section>
  );
};

export default ManifestoSection;
