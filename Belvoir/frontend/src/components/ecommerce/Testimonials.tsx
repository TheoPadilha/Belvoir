import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Ana Silva',
    role: 'Arquiteta',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    text: 'Comprei meu segundo relógio Belvoir. A qualidade é incomparável e o atendimento impecável.',
    rating: 5,
  },
  {
    name: 'Carlos Eduardo',
    role: 'Empresário',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    text: 'O relógio perfeito para qualquer ocasião. Elegante, discreto e de altíssima qualidade.',
    rating: 5,
  },
  {
    name: 'Mariana Costa',
    role: 'Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    text: 'Design impecável! Recebo elogios toda vez que uso. Vale cada centavo investido.',
    rating: 5,
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials = ({ testimonials = defaultTestimonials }: TestimonialsProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>('.testimonial-card');

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    );

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
    <section ref={sectionRef} className="py-20 md:py-24 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
            Depoimentos
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
            O Que Dizem Nossos Clientes
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400" />
            ))}
          </div>
          <p className="text-secondary-600">Mais de 10.000 clientes satisfeitos</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-white rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow duration-500 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-200" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-secondary-700 text-lg mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-charcoal">{testimonial.name}</p>
                  <p className="text-sm text-secondary-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
