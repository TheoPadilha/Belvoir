import { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { FadeIn, AnimatedText, PageTransition } from '../../components/animations';
import { Button, Input } from '../../components/ui';
import { toast } from '../../store/uiStore';

// Configurações do EmailJS - substituir pelos valores reais em produção
// Para obter: https://www.emailjs.com/docs/tutorial/overview/
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'demo_service';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'demo_template';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key';

export const ContactPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Verificar se EmailJS está configurado
    if (EMAILJS_SERVICE_ID === 'demo_service' || !import.meta.env.VITE_EMAILJS_SERVICE_ID) {
      // Modo demo - simular envio
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Mensagem enviada com sucesso! (Modo demonstração)');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
      return;
    }

    // Enviar via EmailJS
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );

      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageTransition>
      {/* Spacer para garantir que o conteúdo fique abaixo do header */}
      <div className="h-4" />

      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] flex items-center justify-center overflow-hidden mx-4 lg:mx-8 rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
          <FadeIn>
            <span className="text-sm uppercase tracking-widest text-primary-400 mb-4 block">
              Fale Conosco
            </span>
          </FadeIn>
          <AnimatedText
            as="h1"
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-4"
            animation="fadeUp"
          >
            Entre em Contato
          </AnimatedText>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <FadeIn>
                <h2 className="font-display text-2xl mb-8">Informações</h2>
              </FadeIn>

              <div className="space-y-6">
                <FadeIn delay={0.1}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Boutique</h3>
                      <p className="text-secondary-600">
                        Rua Oscar Freire, 123<br />
                        Jardins - São Paulo, SP<br />
                        CEP 01426-001
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Telefone</h3>
                      <p className="text-secondary-600">
                        <a href="tel:+551130001234" className="hover:text-primary-500">
                          (11) 3000-1234
                        </a>
                      </p>
                      <p className="text-secondary-600">
                        <a href="https://wa.me/5511999999999" className="hover:text-primary-500">
                          WhatsApp: (11) 99999-9999
                        </a>
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">E-mail</h3>
                      <p className="text-secondary-600">
                        <a href="mailto:contato@belvoirrelogios.com" className="hover:text-primary-500">
                          contato@belvoirrelogios.com
                        </a>
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Horário</h3>
                      <p className="text-secondary-600">
                        Segunda a Sexta: 10h às 19h<br />
                        Sábado: 10h às 18h<br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="bg-secondary-50 p-8 md:p-12">
                  <h2 className="font-display text-2xl mb-6">Envie uma Mensagem</h2>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nome Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome"
                      />
                      <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Telefone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                      />
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Assunto
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-secondary-200 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="compra">Dúvida sobre Compra</option>
                          <option value="produto">Informação sobre Produto</option>
                          <option value="assistencia">Assistência Técnica</option>
                          <option value="corporativo">Vendas Corporativas</option>
                          <option value="outro">Outro Assunto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Mensagem
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Como podemos ajudá-lo?"
                        className="w-full px-4 py-3 bg-white border border-secondary-200 text-charcoal placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <Button type="submit" isLoading={isSubmitting}>
                      <Send size={18} className="mr-2" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px] bg-secondary-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975674661396!2d-46.67226012374567!3d-23.562429261674673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59cda1f21f0f%3A0x6c4f5c1b68f2b0a0!2sR.%20Oscar%20Freire%20-%20Jardim%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1699999999999!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização da Boutique Belvoir"
        />
      </section>
    </PageTransition>
  );
};

export default ContactPage;
