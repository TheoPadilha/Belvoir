import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Collection {
  name: string;
  description: string;
  image: string;
  link: string;
}

const defaultCollections: Collection[] = [
  {
    name: 'Coleção Vintage',
    description: 'Clássicos reinventados',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80',
    link: '/shop?categoria=vintage',
  },
  {
    name: 'Coleção Minimal',
    description: 'Elegância discreta',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    link: '/shop?categoria=minimalista',
  },
  {
    name: 'Coleção Sport',
    description: 'Performance e estilo',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80',
    link: '/shop?categoria=esportivo',
  },
];

interface CollectionsShowcaseProps {
  collections?: Collection[];
}

export const CollectionsShowcase = ({ collections = defaultCollections }: CollectionsShowcaseProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>('.collection-card');

    // Parallax effect
    cards.forEach((card, index) => {
      const speed = (index % 2) + 1;
      const direction = index % 2 === 0 ? 1 : -1;

      gsap.to(card, {
        y: direction * speed * 50,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      cards.forEach((card) => {
        if (window.getComputedStyle(card).opacity === '0') {
          gsap.set(card, { opacity: 1 });
        }
      });
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-charcoal overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-400 mb-4 block">
            Coleções
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Nossas Coleções
          </h2>
          <p className="text-lg md:text-xl text-secondary-400 max-w-2xl mx-auto">
            Cada coleção conta uma história única
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              to={collection.link}
              className="collection-card group relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-secondary-800"
            >
              <img
                src={collection.image}
                alt={collection.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  // Fallback to a gradient background if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-secondary-300 mb-4">{collection.description}</p>
                <div className="flex items-center gap-2 text-white font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span>Explorar</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsShowcase;
