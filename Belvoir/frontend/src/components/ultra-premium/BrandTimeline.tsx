import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}

interface BrandTimelineProps {
  items?: TimelineItem[];
}

const defaultItems: TimelineItem[] = [
  {
    year: '1987',
    title: 'Fundação',
    description: 'Nasceu o sonho de criar relógios que transcendem o tempo. Em São Paulo, a Belvoir deu seus primeiros passos.',
  },
  {
    year: '2000',
    title: 'Expansão Internacional',
    description: 'Abertura das primeiras boutiques internacionais em Lisboa, Miami e Dubai, levando a elegância brasileira ao mundo.',
  },
  {
    year: '2010',
    title: 'Inovação & Tradição',
    description: 'Lançamento da coleção Atemporal, unindo técnicas centenárias suíças com design contemporâneo brasileiro.',
  },
  {
    year: '2020',
    title: 'Sustentabilidade',
    description: 'Compromisso com o futuro: materiais reciclados, energia renovável e certificação de origem ética.',
  },
  {
    year: '2025',
    title: 'Nova Era',
    description: 'Inauguração do novo atelier em Genebra, consolidando nossa posição entre as grandes maisons relojoeiras.',
  },
];

export const BrandTimeline = ({ items = defaultItems }: BrandTimelineProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timelineItems = gsap.utils.toArray<HTMLElement>('.timeline-item');

    // Animate the center line
    gsap.fromTo(line,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
      }
    );

    // Animate each timeline item
    timelineItems.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      const content = item.querySelector('.timeline-content');
      const dot = item.querySelector('.timeline-dot');

      // Content animation
      if (content) {
        gsap.fromTo(content,
          { x: isLeft ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Dot animation
      if (dot) {
        gsap.fromTo(dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-secondary-900 to-charcoal" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-400 mb-4 block">
            Nossa Jornada
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white">
            Uma História de Excelência
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-primary-500 via-primary-400 to-primary-600"
          />

          {/* Timeline items */}
          <div className="space-y-24 md:space-y-32">
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`timeline-item relative flex items-center ${
                    isLeft ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div
                      className="timeline-content bg-gradient-to-br from-secondary-800/50 to-secondary-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-primary-500/30 transition-colors duration-500"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <span className="timeline-year text-5xl md:text-6xl font-display text-primary-400 block mb-4">
                        {item.year}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-secondary-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className="timeline-dot relative">
                      <div className="w-5 h-5 bg-primary-500 rounded-full border-4 border-charcoal shadow-lg shadow-primary-500/50" />
                      {/* Pulse effect */}
                      <div className="absolute inset-0 w-5 h-5 bg-primary-500 rounded-full animate-ping opacity-30" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTimeline;
