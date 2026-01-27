import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';
import { Button, Input } from '../../components/ui';
import { PageTransition } from '../../components/animations';
import { toast } from '../../store/uiStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptsMarketing: false,
    acceptsTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { hasMinLength, hasUppercase, hasLowercase, hasNumber };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptsTerms) {
      toast.error('Você precisa aceitar os termos de uso');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (!isPasswordValid) {
      toast.error('A senha não atende aos requisitos mínimos');
      return;
    }

    const success = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      acceptsMarketing: formData.acceptsMarketing,
    });

    if (success) {
      toast.success('Conta criada com sucesso! Bem-vindo à Belvoir.');
      navigate('/conta');
    } else {
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (credentialResponse.credential) {
      const success = await loginWithGoogle(credentialResponse.credential);

      if (success) {
        toast.success('Conta criada com Google!');
        navigate('/conta');
      } else {
        toast.error('Erro ao criar conta com Google');
      }
    }
  };

  const handleGoogleError = () => {
    toast.error('Erro ao conectar com Google. Tente novamente.');
  };

  // Fallback para modo demo
  const handleDemoGoogleLogin = async () => {
    const success = await loginWithGoogle('demo_token');

    if (success) {
      toast.success('Conta criada com Google!');
      navigate('/conta');
    } else {
      toast.error('Erro ao criar conta com Google');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 flex">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=80"
            alt="Relógio de luxo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="font-display text-4xl mb-4">
              Junte-se à Belvoir
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Crie sua conta e tenha acesso a benefícios exclusivos.
            </p>
            <ul className="space-y-3">
              {[
                'Acompanhe seus pedidos em tempo real',
                'Salve endereços para compras rápidas',
                'Receba ofertas exclusivas por email',
                'Acesse seu histórico de compras',
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-white/80">
                  <Check size={18} className="text-primary-400" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
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
              <h1 className="font-display text-2xl text-center mb-2">Criar Conta</h1>
              <p className="text-secondary-500 text-center text-sm mb-8">
                Preencha seus dados para criar sua conta
              </p>

              {/* Google Signup */}
              <div className="flex justify-center mb-6">
                {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signup_with"
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
                    <span className="text-secondary-700 font-medium">Cadastrar com Google</span>
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

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Nome"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="João"
                      required
                    />
                    <User
                      size={18}
                      className="absolute right-3 top-[38px] text-secondary-400"
                    />
                  </div>
                  <Input
                    label="Sobrenome"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Silva"
                    required
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
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
                    label="Telefone (opcional)"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                  <Phone
                    size={18}
                    className="absolute right-3 top-[38px] text-secondary-400"
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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

                {/* Password Requirements */}
                {formData.password && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${
                        passwordValidation.hasMinLength ? 'text-green-600' : 'text-secondary-400'
                      }`}
                    >
                      <Check size={12} />
                      Mínimo 8 caracteres
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordValidation.hasUppercase ? 'text-green-600' : 'text-secondary-400'
                      }`}
                    >
                      <Check size={12} />
                      Uma letra maiúscula
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordValidation.hasLowercase ? 'text-green-600' : 'text-secondary-400'
                      }`}
                    >
                      <Check size={12} />
                      Uma letra minúscula
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordValidation.hasNumber ? 'text-green-600' : 'text-secondary-400'
                      }`}
                    >
                      <Check size={12} />
                      Um número
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Confirmar Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[38px] text-secondary-400 hover:text-secondary-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptsMarketing}
                      onChange={(e) => handleChange('acceptsMarketing', e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-primary-500 rounded border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600">
                      Desejo receber novidades e ofertas exclusivas por email
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptsTerms}
                      onChange={(e) => handleChange('acceptsTerms', e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-primary-500 rounded border-secondary-300 focus:ring-primary-500"
                      required
                    />
                    <span className="text-sm text-secondary-600">
                      Li e aceito os{' '}
                      <Link to="/termos" className="text-primary-600 hover:underline">
                        Termos de Uso
                      </Link>{' '}
                      e a{' '}
                      <Link to="/privacidade" className="text-primary-600 hover:underline">
                        Política de Privacidade
                      </Link>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  disabled={!formData.acceptsTerms}
                >
                  Criar Conta
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </form>

              <p className="text-center text-sm text-secondary-500 mt-6">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
