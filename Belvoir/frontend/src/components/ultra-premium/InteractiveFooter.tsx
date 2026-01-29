import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export const InteractiveFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;

    if (!footer || !image || !overlay) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;

      gsap.to(image, {
        x: xPercent * 30,
        y: yPercent * 30,
        scale: 1.1,
        rotation: xPercent * 2,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(overlay, {
        x: -xPercent * 20,
        y: -yPercent * 20,
        duration: 1,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1.05,
        rotation: 0,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(overlay, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });
    };

    footer.addEventListener('mousemove', handleMouseMove);
    footer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
      footer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: MessageCircle, label: 'WhatsApp', href: '#' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Background image with distortion */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover"
          style={{ transformOrigin: 'center', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(184, 115, 51, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Logo */}
        <h2 className="font-display text-7xl md:text-8xl lg:text-9xl mb-6 tracking-wider">
          BELVOIR
        </h2>
        <p className="text-xl md:text-2xl text-white/70 mb-12 font-light">
          Onde o tempo encontra a perfeição
        </p>

        {/* Social links */}
        <div className="flex gap-6 justify-center mb-16">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">{label}</span>
            </a>
          ))}
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap gap-8 justify-center mb-12 text-sm uppercase tracking-wider">
          <Link to="/shop" className="text-white/60 hover:text-white transition-colors">
            Coleção
          </Link>
          <Link to="/sobre" className="text-white/60 hover:text-white transition-colors">
            Sobre
          </Link>
          <Link to="/contato" className="text-white/60 hover:text-white transition-colors">
            Contato
          </Link>
          <Link to="/conta" className="text-white/60 hover:text-white transition-colors">
            Minha Conta
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-white/40 text-sm">
          &copy; {new Date().getFullYear()} Belvoir. Todos os direitos reservados.
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-[1px] bg-gradient-to-r from-white/30 to-transparent" />
      <div className="absolute top-8 left-8 w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent" />
      <div className="absolute bottom-8 right-8 w-16 h-[1px] bg-gradient-to-l from-white/30 to-transparent" />
      <div className="absolute bottom-8 right-8 w-[1px] h-16 bg-gradient-to-t from-white/30 to-transparent" />
    </footer>
  );
};

export default InteractiveFooter;
