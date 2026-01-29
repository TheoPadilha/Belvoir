import { useState } from 'react';
import { Send, Gift } from 'lucide-react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      // Here you would typically send the email to your backend
    }
  };

  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Fique por Dentro
          </h2>
          <p className="text-lg md:text-xl text-primary-100 mb-8">
            Receba lançamentos exclusivos, ofertas especiais e conteúdo sobre relojoaria
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 px-6 py-4 rounded-full text-charcoal placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-white bg-white"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-charcoal text-white rounded-full font-bold hover:bg-secondary-900 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Inscrever
              </button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Obrigado por se inscrever!</h3>
              <p className="text-primary-100">
                Você receberá seu cupom de 10% OFF em instantes.
              </p>
            </div>
          )}

          <p className="text-sm text-primary-200 mt-4 flex items-center justify-center gap-2">
            <Gift className="w-4 h-4" />
            Ganhe 10% OFF na primeira compra
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
