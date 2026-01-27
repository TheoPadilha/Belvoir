import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';
import { Button, Input } from '../../components/ui';
import { PageTransition } from '../../components/animations';
import { toast } from '../../store/uiStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Pegar a página de redirecionamento após login
  const from = (location.state as { from?: string })?.from || '/conta';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    const success = await login(email, password);

    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate(from, { replace: true });
    } else {
      toast.error('Email ou senha incorretos');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (credentialResponse.credential) {
      const success = await loginWithGoogle(credentialResponse.credential);

      if (success) {
        toast.success('Login com Google realizado!');
        navigate(from, { replace: true });
      } else {
        toast.error('Erro ao fazer login com Google');
      }
    }
  };

  const handleGoogleError = () => {
    toast.error('Erro ao conectar com Google. Tente novamente.');
  };

  // Fallback para modo demo (quando não há Client ID configurado)
  const handleDemoGoogleLogin = async () => {
    const success = await loginWithGoogle('demo_token');

    if (success) {
      toast.success('Login com Google realizado!');
      navigate(from, { replace: true });
    } else {
      toast.error('Erro ao fazer login com Google');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 flex">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1200&q=80"
            alt="Relógio de luxo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="font-display text-4xl mb-4">
              Bem-vindo de volta
            </h2>
            <p className="text-white/80 text-lg">
              Acesse sua conta para acompanhar pedidos, gerenciar endereços e muito mais.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <Link to="/" className="block text-center mb-8">
              <span className="font-display text-3xl font-semibold text-charcoal">
                BELVOIR
              </span>
            </Link>

            <div className="bg-white p-8 shadow-sm">
              <h1 className="font-display text-2xl text-center mb-2">Entrar</h1>
              <p className="text-secondary-500 text-center text-sm mb-8">
                Digite suas credenciais para acessar sua conta
              </p>

              {/* Google Login */}
              <div className="flex justify-center mb-6">
                {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    width="350"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleDemoGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-secondary-700 font-medium">Continuar com Google</span>
                  </button>
                )}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-secondary-400">ou</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                  <Mail
                    size={18}
                    className="absolute right-3 top-[38px] text-secondary-400"
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-primary-500 rounded border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600">Lembrar de mim</span>
                  </label>
                  <Link
                    to="/recuperar-senha"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Entrar
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </form>

              <p className="text-center text-sm text-secondary-500 mt-6">
                Não tem uma conta?{' '}
                <Link
                  to="/cadastro"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Criar conta
                </Link>
              </p>
            </div>

            {/* Demo notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Modo Demonstração:</strong> Use qualquer email e senha para testar.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
