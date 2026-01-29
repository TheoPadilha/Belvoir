import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

type CursorState = 'default' | 'link' | 'view' | 'zoom' | 'drag' | 'hidden';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [cursorText, setCursorText] = useState('');
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  // Check if device supports hover (not touch-only)
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices with fine pointer (mouse)
    const hasFinPointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldShow = hasFinPointer && !prefersReducedMotion;
    setIsDesktop(shouldShow);

    // Add/remove class to hide default cursor
    if (shouldShow) {
      document.body.classList.add('custom-cursor-active');
    }

    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  const animate = useCallback(() => {
    // Smooth follow with different speeds for outer ring and dot
    cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
    cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

    if (cursorRef.current) {
      gsap.set(cursorRef.current, {
        x: cursorPos.current.x - 24,
        y: cursorPos.current.y - 24,
      });
    }

    if (cursorDotRef.current) {
      gsap.set(cursorDotRef.current, {
        x: mousePos.current.x - 4,
        y: mousePos.current.y - 4,
      });
    }

    if (cursorTextRef.current && cursorText) {
      gsap.set(cursorTextRef.current, {
        x: mousePos.current.x,
        y: mousePos.current.y - 40,
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [cursorText]);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;

      // Check for data attributes first
      if (target.dataset.cursor) {
        setCursorState(target.dataset.cursor as CursorState);
        if (target.dataset.cursorText) {
          setCursorText(target.dataset.cursorText);
        }
        return;
      }

      // Auto-detect element types
      const tagName = target.tagName.toLowerCase();
      const isButton = tagName === 'button' || target.closest('button');
      const isLink = tagName === 'a' || target.closest('a');
      const isProductCard = target.classList.contains('product-card') || target.closest('.product-card');
      const isImage = tagName === 'img' && target.classList.contains('cursor-zoom');

      if (isProductCard) {
        setCursorState('view');
        setCursorText('VER');
      } else if (isImage) {
        setCursorState('zoom');
        setCursorText('');
      } else if (isButton || isLink) {
        setCursorState('link');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setCursorState('default');
      setCursorText('');
    };

    // Start animation
    document.addEventListener('mousemove', handleMouseMove);
    animate();

    // Add listeners to interactive elements
    const addListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor], .product-card, img.cursor-zoom'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return interactiveElements;
    };

    const elements = addListeners();

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      addListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, [isDesktop, animate]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`
          fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999]
          rounded-full border-[1.5px] transition-all duration-300 ease-out
          ${cursorState === 'default' ? 'border-charcoal/40 scale-100' : ''}
          ${cursorState === 'link' ? 'border-primary-500 scale-125 bg-primary-500/5' : ''}
          ${cursorState === 'view' ? 'border-primary-500 scale-[2] bg-charcoal/90' : ''}
          ${cursorState === 'zoom' ? 'border-charcoal scale-150 bg-white/10' : ''}
          ${cursorState === 'hidden' ? 'opacity-0 scale-0' : ''}
        `}
        style={{ mixBlendMode: cursorState === 'view' ? 'normal' : 'difference' }}
      >
        {/* Text inside cursor for 'view' state */}
        {cursorState === 'view' && cursorText && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-widest text-white uppercase">
            {cursorText}
          </span>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`
          fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999]
          rounded-full transition-all duration-150 ease-out
          ${cursorState === 'default' ? 'bg-charcoal scale-100' : ''}
          ${cursorState === 'link' ? 'bg-primary-500 scale-150' : ''}
          ${cursorState === 'view' ? 'bg-transparent scale-0' : ''}
          ${cursorState === 'zoom' ? 'bg-charcoal scale-200' : ''}
          ${cursorState === 'hidden' ? 'opacity-0 scale-0' : ''}
        `}
      />
    </>
  );
};

export default CustomCursor;
