import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';

type AnimationType = 'letterByLetter' | 'wordByWord' | 'fadeUp' | 'reveal';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  animateOnView?: boolean;
  animation?: AnimationType;
  trigger?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const AnimatedText = ({
  text,
  className = '',
  delay = 0,
  duration = 800,
  staggerDelay = 40,
  animateOnView = true,
  animation = 'letterByLetter',
  trigger,
  as: Tag = 'span',
}: AnimatedTextProps) => {
  const textRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine split method based on animation type
    const splitByWord = animation === 'wordByWord';
    const items = splitByWord ? text.split(' ') : text.split('');

    // Split text into elements
    const elements = items.map((item, i) => {
      const isSpace = !splitByWord && item === ' ';
      return `<span
        class="inline-block anim-item"
        style="opacity: ${prefersReducedMotion ? 1 : 0}; transform: translateY(${prefersReducedMotion ? 0 : 40}px);"
        data-index="${i}"
      >${isSpace ? '&nbsp;' : item}${splitByWord && i < items.length - 1 ? '&nbsp;' : ''}</span>`;
    }).join('');

    textRef.current.innerHTML = elements;

    if (prefersReducedMotion) {
      setHasAnimated(true);
      return;
    }

    const runAnimation = () => {
      if (hasAnimated) return;

      const animItems = textRef.current?.querySelectorAll('.anim-item');
      if (!animItems || animItems.length === 0) return;

      const delayMs = delay * 1000; // Convert seconds to ms

      animate(animItems, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: duration,
        delay: stagger(staggerDelay, { start: delayMs }),
        easing: 'easeOutExpo',
      });

      setHasAnimated(true);
    };

    // If trigger prop is provided, use it to control animation
    if (trigger !== undefined) {
      if (trigger && !hasAnimated) {
        runAnimation();
      }
      return;
    }

    // Otherwise use IntersectionObserver
    if (animateOnView) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(textRef.current);

      return () => observer.disconnect();
    } else {
      runAnimation();
    }
  }, [text, delay, duration, staggerDelay, animateOnView, animation, trigger, hasAnimated]);

  return (
    <Tag
      ref={textRef as React.RefObject<HTMLHeadingElement>}
      className={`overflow-hidden ${className}`}
      aria-label={text}
    />
  );
};

export default AnimatedText;
