import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'splitChars' | 'splitWords';
  delay?: number;
  duration?: number;
  stagger?: number;
  scrollTrigger?: boolean;
}

export const AnimatedText = ({
  children,
  as: Component = 'p',
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  stagger = 0.02,
  scrollTrigger = true,
}: AnimatedTextProps) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let elements: Element[] = [];
    let ctx: gsap.Context;

    ctx = gsap.context(() => {
      if (animation === 'splitChars' || animation === 'splitWords') {
        // Split text into spans
        const text = container.textContent || '';
        const splitBy = animation === 'splitChars' ? '' : ' ';
        const parts = text.split(splitBy);

        container.innerHTML = parts
          .map((part, i) => {
            if (animation === 'splitWords' && i < parts.length - 1) {
              return `<span class="inline-block overflow-hidden"><span class="split-element inline-block">${part}</span></span> `;
            }
            return `<span class="inline-block overflow-hidden"><span class="split-element inline-block">${part}</span></span>`;
          })
          .join('');

        elements = Array.from(container.querySelectorAll('.split-element'));
      } else {
        elements = [container];
      }

      const animationConfig = {
        fadeUp: {
          from: { y: 40, opacity: 0 },
          to: { y: 0, opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        splitChars: {
          from: { y: '100%', opacity: 0 },
          to: { y: '0%', opacity: 1 },
        },
        splitWords: {
          from: { y: '100%', opacity: 0 },
          to: { y: '0%', opacity: 1 },
        },
      };

      const config = animationConfig[animation];

      gsap.set(elements, config.from);

      const tween = gsap.to(elements, {
        ...config.to,
        duration,
        delay,
        stagger: animation.startsWith('split') ? stagger : 0,
        ease: 'power3.out',
        scrollTrigger: scrollTrigger
          ? {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          : undefined,
      });

      return () => {
        tween.kill();
      };
    }, container);

    return () => ctx.revert();
  }, [animation, delay, duration, stagger, scrollTrigger]);

  return (
    <Component ref={containerRef as any} className={className}>
      {children}
    </Component>
  );
};
