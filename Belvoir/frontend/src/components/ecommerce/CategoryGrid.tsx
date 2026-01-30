import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import category1 from '../../assets/images/watches/category-1.jpg';
import category2 from '../../assets/images/watches/category-2.jpg';
import category3 from '../../assets/images/watches/category-3.jpg';
import category4 from '../../assets/images/watches/category-4.jpg';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  name: string;
  image: string;
  count: string;
  link: string;
}

const defaultCategories: Category[] = [
  {
    name: 'Belvoir Classic',
    image: category1,
    count: '24 modelos',
    link: '/shop?categoria=classic',
  },
  {
    name: 'Belvoir Lux',
    image: category2,
    count: '18 modelos',
    link: '/shop?categoria=lux',
  },
  {
    name: 'Para Ele',
    image: category3,
    count: '32 modelos',
    link: '/shop?categoria=masculino',
  },
  {
    name: 'Para Ela',
    image: category4,
    count: '28 modelos',
    link: '/shop?categoria=feminino',
  },
];

interface CategoryGridProps {
  categories?: Category[];
}

export const CategoryGrid = ({ categories = defaultCategories }: CategoryGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>('.category-card');

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      cards.forEach((card) => {
        if (window.getComputedStyle(card).opacity === '0') {
          gsap.set(card, { y: 0, opacity: 1 });
        }
      });
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
            Categorias
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
            Explore por Categoria
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
            Encontre o relógio perfeito para o seu estilo
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="category-card group relative h-80 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-secondary-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {category.count}
                </p>
                <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>Ver Coleção</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
