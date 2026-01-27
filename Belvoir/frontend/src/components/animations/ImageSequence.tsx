import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../utils/animationConfig';

gsap.registerPlugin(ScrollTrigger);

interface ImageSequenceProps {
  /** Array de URLs das imagens em sequência */
  urls: string[];
  /** Largura do canvas */
  width?: number;
  /** Altura do canvas */
  height?: number;
  /** Altura da seção (em vh ou px) */
  sectionHeight?: string;
  /** Texto opcional para overlay */
  overlayContent?: React.ReactNode;
}

/**
 * Componente de Image Sequence estilo Apple
 * Sincroniza frames de imagem com o scroll da página
 *
 * IMPORTANTE: Necessita de múltiplas imagens em sequência
 * Para teste, pode usar menos frames (30-60 imagens)
 */
export const ImageSequence = ({
  urls,
  width = 1920,
  height = 1080,
  sectionHeight = '300vh',
  overlayContent,
}: ImageSequenceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || urls.length === 0) return;
    if (prefersReducedMotion()) {
      setIsLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let curFrame = -1;
    let loadedCount = 0;

    // Pre-load todas as imagens
    const images = urls.map((url, i) => {
      const img = new Image();
      img.src = url;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / urls.length) * 100));

        // Desenha primeira imagem quando carregar
        if (i === 0 && ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        // Quando todas carregarem, remover loading
        if (loadedCount === urls.length) {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / urls.length) * 100));
        if (loadedCount === urls.length) {
          setIsLoading(false);
        }
      };

      return img;
    });

    // Função para atualizar o frame baseado no scroll
    const updateImage = (frame: number) => {
      const roundedFrame = Math.round(frame);
      if (roundedFrame !== curFrame && images[roundedFrame] && images[roundedFrame].complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[roundedFrame], 0, 0, canvas.width, canvas.height);
        curFrame = roundedFrame;
      }
    };

    // Configurar animação com ScrollTrigger
    const animation = gsap.to(
      { frame: 0 },
      {
        frame: images.length - 1,
        ease: 'none',
        onUpdate: function () {
          updateImage(this.targets()[0].frame);
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          pin: canvas,
          pinSpacing: false,
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [urls, width, height]);

  // Se não há imagens ou preferência por movimento reduzido
  if (urls.length === 0 || prefersReducedMotion()) {
    return (
      <div className="relative bg-black" style={{ height: '100vh' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {overlayContent || (
            <p className="text-white/50 text-lg">Image Sequence não configurado</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: sectionHeight }}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm">Carregando experiência... {loadProgress}%</p>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
        style={{ opacity: isLoading ? 0 : 1 }}
      />

      {/* Overlay Content */}
      {overlayContent && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          {overlayContent}
        </div>
      )}
    </div>
  );
};

/**
 * Versão simplificada com parallax para quando não há frames disponíveis
 */
export const ParallaxHero = ({
  imageUrl,
  children,
}: {
  imageUrl: string;
  children?: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || prefersReducedMotion()) return;

    gsap.to(imageRef.current, {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[150%] -top-[25%]"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>
      {children && (
        <div className="relative h-full flex items-center">
          {children}
        </div>
      )}
    </div>
  );
};
