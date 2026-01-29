import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Promo {
  icon: string;
  text: string;
  highlight: boolean;
}

export const PromoBanner = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  const promos: Promo[] = [
    { icon: '🎁', text: 'FRETE GRÁTIS acima de R$350', highlight: true },
    { icon: '💳', text: 'Parcele em até 12x sem juros', highlight: false },
    { icon: '⏰', text: 'HOJE: 10% OFF na primeira compra', highlight: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [promos.length]);

  useEffect(() => {
    if (bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentPromo]);

  const promo = promos[currentPromo];

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[60]
        ${promo.highlight ? 'bg-gradient-to-r from-primary-600 to-primary-500' : 'bg-charcoal'}
        text-white text-center py-2.5 px-4
      `}
    >
      <div ref={bannerRef} className="flex items-center justify-center gap-3">
        <span className="text-xl">{promo.icon}</span>
        <span className="font-medium text-sm sm:text-base">{promo.text}</span>
      </div>

      {/* Dots indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex gap-1.5">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPromo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentPromo ? 'bg-white w-4' : 'bg-white/30 w-1.5'
            }`}
            aria-label={`Promoção ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
