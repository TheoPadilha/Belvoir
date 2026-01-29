import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameAnimationProps {
  frameCount?: number;
  framePrefix?: string;
  frameExtension?: string;
  title?: string;
  subtitle?: string;
}

export const ScrollFrameAnimation = ({
  frameCount = 243,
  framePrefix = '/frames/ezgif-frame-',
  frameExtension = '.jpg',
  title = 'Precisão em Cada Detalhe',
  subtitle = 'Mergulhe no universo da alta relojoaria e descubra a arte por trás de cada movimento.',
}: ScrollFrameAnimationProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Generate frame paths with proper padding
    const getFramePath = (index: number) => {
      const paddedIndex = String(index).padStart(3, '0');
      return `${framePrefix}${paddedIndex}${frameExtension}`;
    };

    // Preload all images
    const preloadImages = async () => {
      const images: HTMLImageElement[] = [];
      let loaded = 0;

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);

        await new Promise<void>((resolve) => {
          img.onload = () => {
            loaded++;
            setLoadProgress(Math.round((loaded / frameCount) * 100));
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load frame ${i}`);
            resolve();
          };
        });

        images.push(img);
      }

      imagesRef.current = images;
      setIsLoading(false);

      // Draw first frame
      if (images[0] && images[0].complete) {
        drawFrame(0, ctx, canvas);
      }
    };

    // Draw a specific frame
    const drawFrame = (index: number, context: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const canvasWidth = cvs.width / (window.devicePixelRatio || 1);
      const canvasHeight = cvs.height / (window.devicePixelRatio || 1);

      // Clear canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Calculate dimensions to cover canvas while maintaining aspect ratio
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Start preloading
    preloadImages();

    // Setup ScrollTrigger after images are loaded
    const setupScrollTrigger = () => {
      if (imagesRef.current.length === 0) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            Math.floor(self.progress * (frameCount - 1)),
            frameCount - 1
          );

          if (frameIndex !== frameIndexRef.current) {
            frameIndexRef.current = frameIndex;
            if (ctx && canvas) {
              drawFrame(frameIndex, ctx, canvas);
            }
          }
        },
      });
    };

    // Wait for images to load before setting up ScrollTrigger
    const checkLoaded = setInterval(() => {
      if (!isLoading && imagesRef.current.length > 0) {
        clearInterval(checkLoaded);
        setupScrollTrigger();
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      clearInterval(checkLoaded);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [frameCount, framePrefix, frameExtension, isLoading]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-charcoal -mt-20 lg:-mt-24"
      style={{ height: '150vh' }} // 1.5x viewport height for faster scroll
    >
      {/* Sticky canvas container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pt-20 lg:pt-24">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-charcoal">
            <div className="w-64 h-1 bg-secondary-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-primary-500 transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-secondary-400 text-sm tracking-wider">
              Carregando {loadProgress}%
            </span>
          </div>
        )}

        {/* Canvas for frame animation */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/60 pointer-events-none z-5" />

        {/* Text content - always visible */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4">
          <div className="text-center w-full max-w-4xl bg-black/30 backdrop-blur-sm py-8 md:py-12 px-6 md:px-10 rounded-2xl">
            <span
              className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary-400 mb-4 md:mb-6 block font-semibold"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
            >
              Craftsmanship
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 md:mb-6 leading-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9)' }}
            >
              {title}
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-2xl mx-auto leading-relaxed"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
          <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Scroll</span>
          <div className="w-px h-8 md:h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>

        {/* Corner decorations - hidden on small screens */}
        <div className="hidden md:block absolute top-8 left-8 w-16 h-px bg-gradient-to-r from-primary-500/40 to-transparent" />
        <div className="hidden md:block absolute top-8 left-8 w-px h-16 bg-gradient-to-b from-primary-500/40 to-transparent" />
        <div className="hidden md:block absolute bottom-8 right-8 w-16 h-px bg-gradient-to-l from-primary-500/40 to-transparent" />
        <div className="hidden md:block absolute bottom-8 right-8 w-px h-16 bg-gradient-to-t from-primary-500/40 to-transparent" />
      </div>
    </section>
  );
};

export default ScrollFrameAnimation;
