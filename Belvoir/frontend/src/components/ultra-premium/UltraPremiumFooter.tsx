import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowUpRight, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Link Component
const MagneticLink = ({
  children,
  href,
  external = false,
  className = ''
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(link, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(link, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    link.addEventListener('mousemove', handleMouseMove);
    link.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      link.removeEventListener('mousemove', handleMouseMove);
      link.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (external) {
    return (
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={linkRef} to={href} className={`inline-block ${className}`}>
      {children}
    </Link>
  );
};

// Animated Counter Component
const AnimatedYear = ({ year }: { year: number }) => {
  const [displayYear, setDisplayYear] = useState(1987);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let current = 1987;
          const target = year;
          const duration = 2000;
          const step = (target - current) / (duration / 16);

          const animate = () => {
            current += step;
            if (current < target) {
              setDisplayYear(Math.floor(current));
              requestAnimationFrame(animate);
            } else {
              setDisplayYear(target);
            }
          };
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [year]);

  return <span ref={ref}>{displayYear}</span>;
};

export const UltraPremiumFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const marquee = marqueeRef.current;
    const cta = ctaRef.current;

    if (!footer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Marquee animation
    if (marquee) {
      const marqueeText = marquee.querySelector('.marquee-text');
      if (marqueeText) {
        gsap.to(marqueeText, {
          xPercent: -50,
          duration: 20,
          ease: 'none',
          repeat: -1,
        });
      }
    }

    // CTA reveal animation
    if (cta) {
      gsap.fromTo(cta,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Stagger animation for links - only animate if IntersectionObserver is supported
    const linkGroups = footer.querySelectorAll('.footer-link-group');
    linkGroups.forEach((group, groupIndex) => {
      const links = group.querySelectorAll('.footer-link');
      if (links.length === 0) return;

      // Set initial state
      gsap.set(links, { y: 20, opacity: 0 });

      // Create ScrollTrigger with immediate check
      ScrollTrigger.create({
        trigger: group,
        start: 'top 95%',
        onEnter: () => {
          gsap.to(links, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.04,
            delay: groupIndex * 0.08,
            ease: 'power2.out',
          });
        },
        once: true,
      });
    });

    // Fallback: ensure links are visible after a short delay
    const fallbackTimeout = setTimeout(() => {
      const allLinks = footer.querySelectorAll('.footer-link');
      allLinks.forEach((link) => {
        if (window.getComputedStyle(link).opacity === '0') {
          gsap.set(link, { y: 0, opacity: 1 });
        }
      });
    }, 1500);

    return () => {
      clearTimeout(fallbackTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    collection: [
      { label: 'Cronógrafos', href: '/shop?categoria=cronografos' },
      { label: 'Clássicos', href: '/shop?categoria=classicos' },
      { label: 'Esportivos', href: '/shop?categoria=esportivos' },
      { label: 'Alta Relojoaria', href: '/shop?categoria=alta-relojoaria' },
      { label: 'Edições Limitadas', href: '/shop?categoria=edicoes-limitadas' },
    ],
    company: [
      { label: 'Nossa História', href: '/sobre' },
      { label: 'Atelier', href: '/sobre#atelier' },
      { label: 'Sustentabilidade', href: '/sobre#sustentabilidade' },
      { label: 'Carreiras', href: '/carreiras' },
      { label: 'Imprensa', href: '/imprensa' },
    ],
    support: [
      { label: 'Contato', href: '/contato' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Garantia', href: '/garantia' },
      { label: 'Manutenção', href: '/manutencao' },
      { label: 'Rastreio', href: '/rastreio' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/belvoirrelogios', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/belvoirrelogios', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com/belvoirrelogios', label: 'Youtube' },
  ];

  return (
    <footer ref={footerRef} className="relative bg-charcoal text-white overflow-hidden">
      {/* Large CTA Section */}
      <div ref={ctaRef} className="relative py-24 md:py-32 border-b border-white/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-primary-400 mb-6 block">
              Pronto para encontrar seu relógio?
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-none">
              Descubra a
              <span className="block text-primary-400">Arte do Tempo</span>
            </h2>
            <p className="text-xl text-secondary-400 mb-12 max-w-2xl mx-auto">
              Cada Belvoir é uma declaração de quem você é. Encontre a peça que conta sua história.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <MagneticLink
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-full text-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Explorar Coleção
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MagneticLink>
              <MagneticLink
                href="/contato"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-white/30 text-white rounded-full text-lg font-medium hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Agendar Visita
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </MagneticLink>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Scrolling Marquee */}
      <div ref={marqueeRef} className="py-8 border-b border-white/10 overflow-hidden">
        <div className="marquee-text flex whitespace-nowrap" style={{ width: '200%' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[10vw] font-display text-white/5 tracking-tight mx-8">
              BELVOIR • SINCE 1987 • ELEGÂNCIA ATEMPORAL •
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-20 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <Link to="/" className="inline-block mb-8">
                <span className="font-display text-5xl tracking-wider">BELVOIR</span>
              </Link>
              <p className="text-secondary-400 text-lg leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0">
                Desde <AnimatedYear year={1987} />, criamos relógios que transcendem o tempo.
                Cada peça é uma obra de arte que conta histórias e marca momentos.
              </p>

              {/* Social Links */}
              <div className="flex gap-4 justify-center lg:justify-start">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <MagneticLink
                    key={label}
                    href={href}
                    external
                    className="group w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-primary-500 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-white/70 group-hover:text-primary-400 transition-colors" />
                  </MagneticLink>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left">
                {/* Collection Links */}
                <div className="footer-link-group">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-primary-400 mb-6 font-medium">
                    Coleção
                  </h4>
                  <ul className="space-y-4">
                    {footerLinks.collection.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="footer-link group inline-flex items-center text-secondary-300 hover:text-white transition-colors"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary-500 transition-all duration-300 group-hover:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div className="footer-link-group">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-primary-400 mb-6 font-medium">
                    Empresa
                  </h4>
                  <ul className="space-y-4">
                    {footerLinks.company.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="footer-link group inline-flex items-center text-secondary-300 hover:text-white transition-colors"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary-500 transition-all duration-300 group-hover:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support Links */}
                <div className="footer-link-group">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-primary-400 mb-6 font-medium">
                    Suporte
                  </h4>
                  <ul className="space-y-4">
                    {footerLinks.support.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="footer-link group inline-flex items-center text-secondary-300 hover:text-white transition-colors"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary-500 transition-all duration-300 group-hover:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-sm text-secondary-500 mb-1">Boutique</span>
                  <span className="text-white">Rua Oscar Freire, 123 - Jardins, SP</span>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-sm text-secondary-500 mb-1">Telefone</span>
                  <a href="tel:+551130001234" className="text-white hover:text-primary-400 transition-colors">
                    (11) 3000-1234
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center md:justify-end">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-sm text-secondary-500 mb-1">E-mail</span>
                  <a href="mailto:contato@belvoir.com.br" className="text-white hover:text-primary-400 transition-colors">
                    contato@belvoir.com.br
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-secondary-500 text-sm">
              &copy; {currentYear} Belvoir Relógios. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-8 text-sm">
              <Link to="/politicas/privacidade" className="text-secondary-500 hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link to="/politicas/termos" className="text-secondary-500 hover:text-white transition-colors">
                Termos
              </Link>
              <Link to="/politicas/cookies" className="text-secondary-500 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-8 left-8 w-16 h-[1px] bg-gradient-to-r from-primary-500/30 to-transparent" />
        <div className="absolute top-8 left-8 w-[1px] h-16 bg-gradient-to-b from-primary-500/30 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-8 right-8 w-16 h-[1px] bg-gradient-to-l from-primary-500/30 to-transparent" />
        <div className="absolute top-8 right-8 w-[1px] h-16 bg-gradient-to-b from-primary-500/30 to-transparent" />
      </div>
    </footer>
  );
};

export default UltraPremiumFooter;
