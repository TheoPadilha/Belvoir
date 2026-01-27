import { FadeIn, AnimatedText, PageTransition } from '../../components/animations';
import { Award, Users, Globe, Clock } from 'lucide-react';

const stats = [
  { icon: Clock, value: '37', label: 'Anos de História' },
  { icon: Award, value: '150+', label: 'Prêmios Internacionais' },
  { icon: Users, value: '50.000+', label: 'Clientes Satisfeitos' },
  { icon: Globe, value: '30+', label: 'Países Atendidos' },
];

export const AboutPage = () => {
  return (
    <PageTransition>
      {/* Hero - margin negativo para hero sobre o header */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden -mt-20 lg:-mt-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
          <FadeIn>
            <span className="text-sm uppercase tracking-widest text-primary-400 mb-4 block">
              Nossa História
            </span>
          </FadeIn>
          <AnimatedText
            as="h1"
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-4"
            animation="fadeUp"
          >
            A Arte de Medir o Tempo
          </AnimatedText>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.1}>
                <div className="text-center text-white">
                  <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-4" />
                  <div className="font-display text-4xl font-semibold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-secondary-300 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <img
                src="https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800&q=80"
                alt="Atelier Belvoir"
                className="w-full aspect-[4/5] object-cover"
              />
            </FadeIn>
            <div>
              <FadeIn>
                <span className="text-sm uppercase tracking-widest text-primary-500 mb-4 block">
                  Nossa Origem
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                  Uma Tradição que Começou em 1987
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-4 text-secondary-600">
                  <p>
                    A Belvoir nasceu da paixão de dois mestres relojoeiros brasileiros que, após anos de aprendizado nos ateliers mais renomados da Suíça, decidiram trazer a excelência da alta relojoaria para o Brasil.
                  </p>
                  <p>
                    Em um pequeno atelier no coração de São Paulo, começaram a criar relógios que uniam a precisão suíça com a criatividade e o calor brasileiro. Cada peça era feita à mão, com atenção obsessiva aos detalhes.
                  </p>
                  <p>
                    Hoje, quase quatro décadas depois, a Belvoir é reconhecida internacionalmente como uma das mais prestigiadas casas relojoeiras da América Latina, mantendo o mesmo compromisso com a excelência que nos definiu desde o primeiro dia.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <span className="text-sm uppercase tracking-widest text-primary-500 mb-4 block">
                Nossa Filosofia
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                O Tempo Como Obra de Arte
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xl text-secondary-600 leading-relaxed">
                "Acreditamos que um relógio é muito mais que um instrumento para medir horas. É uma expressão de quem você é, um companheiro para seus momentos mais importantes, e um legado que atravessa gerações."
              </p>
              <p className="mt-6 text-secondary-500 italic">
                — Fundadores da Belvoir
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <FadeIn>
                <span className="text-sm uppercase tracking-widest text-primary-500 mb-4 block">
                  Nosso Processo
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                  Artesanato de Excelência
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl text-charcoal mb-2">Design</h3>
                    <p className="text-secondary-600">
                      Cada novo modelo passa por meses de desenvolvimento, com sketches, protótipos e refinamentos até alcançar a perfeição estética e funcional.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-charcoal mb-2">Fabricação</h3>
                    <p className="text-secondary-600">
                      Nossos mestres relojoeiros trabalham em cada peça por mais de 200 horas, utilizando técnicas tradicionais combinadas com tecnologia de precisão.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-charcoal mb-2">Controle de Qualidade</h3>
                    <p className="text-secondary-600">
                      Antes de deixar nosso atelier, cada relógio passa por 15 etapas de verificação e testes rigorosos que garantem precisão e durabilidade.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
            <FadeIn direction="right" className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=800&q=80"
                alt="Processo de fabricação"
                className="w-full aspect-[4/5] object-cover"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <div className="container-custom text-center">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
              Descubra a Coleção Belvoir
            </h2>
            <p className="text-secondary-300 mb-8 max-w-2xl mx-auto">
              Explore nossa coleção completa e encontre o relógio perfeito para marcar seus momentos mais especiais.
            </p>
            <a
              href="/shop"
              className="inline-flex px-8 py-4 bg-primary-500 text-white uppercase tracking-wider text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Ver Coleção
            </a>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
};

export default AboutPage;
