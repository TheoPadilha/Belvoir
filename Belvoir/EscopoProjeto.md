# Projeto E-commerce Headless com Shopify - Brief Completo

## Contexto do Projeto
Cliente possui loja na Shopify (plano intermediário) e deseja um site totalmente customizado e elegante, mantendo toda gestão de produtos, estoque e pedidos na Shopify. O site atual é Belvoirrelogios.com e as referências de design são:
- https://www.saintgermainbrand.com.br
- https://www.savinitartufi.it/en/
- https://belvoirrelogios.com (site atual - manter todas funcionalidades)

## Objetivo
Criar um e-commerce headless premium com animações sofisticadas, UX impecável, checkout em etapas e SEGURANÇA robusta, conectado à Shopify via Storefront API.

## Stack Técnica Obrigatória

### Frontend
- **Framework**: React 18+ com Vite (TypeScript)
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS
- **Animações**: 
  - GSAP (ScrollTrigger, animações complexas)
  - Lenis (smooth scroll)
  - Framer Motion (transições de página e micro-interações)
- **State Management**: Zustand ou Context API + useReducer
- **Integração**: Shopify Storefront API (GraphQL)
- **HTTP Client**: Axios ou Fetch API nativo
- **Deploy**: Vercel

### Backend/Middleware (para segurança)
- **Node.js + Express** (API intermediária)
- **Deploy Backend**: Hostinger VPS ou Vercel Serverless Functions
- **Propósito**: Proteger tokens da Shopify, rate limiting, validações server-side

### Configurações Shopify
- Storefront API já configurada
- Access token disponível
- Produtos já cadastrados no painel

## Requisitos Funcionais

### 1. Páginas Principais
- **Homepage**
  - Hero section impactante com animações GSAP
  - Smooth scroll com Lenis
  - Destaques de produtos/coleções
  - Parallax effects
  - Seção institucional/sobre a marca
  
- **Catálogo/Shop**
  - Grid de produtos responsivo
  - Filtros por categoria, preço, cor, tamanho
  - Ordenação (relevância, preço, novidades)
  - Paginação ou infinite scroll
  - Quick view dos produtos (modal)
  - Animações de entrada dos cards
  
- **Produto Individual**
  - Galeria de imagens (zoom, lightbox)
  - Seletor de variantes (cor, tamanho)
  - Descrição detalhada
  - Produtos relacionados
  - Disponibilidade em estoque (via Shopify)
  - Botão "Adicionar ao carrinho" com feedback animado
  
- **Carrinho**
  - Sidebar/drawer animado
  - Atualização de quantidade
  - Remoção de itens
  - Cálculo de subtotal em tempo real
  - Sincronização com Shopify
  - Persistência em localStorage (criptografado)
  
- **Checkout em Etapas** (IMPORTANTE)
  - Etapa 1: Informações de contato e entrega
  - Etapa 2: Método de envio
  - Etapa 3: Pagamento
  - Progress bar visual entre etapas
  - Validação em cada etapa (client-side + server-side)
  - Resumo do pedido sempre visível
  - Integração com Shopify Checkout API
  - Token CSRF para proteção

- **Páginas Institucionais**
  - Sobre nós
  - Contato (com reCAPTCHA v3)
  - Políticas (troca, privacidade, termos)
  - FAQ

### 2. Funcionalidades de UX

**Animações com GSAP:**
- Scroll-triggered animations (fade in, slide, scale)
- Parallax em imagens/seções
- Hover effects sofisticados nos produtos
- Transições suaves entre páginas
- Loading animations
- Skeleton screens durante carregamento

**Smooth Scroll com Lenis:**
- Scroll suave em todo o site
- Integração com GSAP ScrollTrigger
- Performance otimizada

**Micro-interações:**
- Botões com hover states elaborados
- Feedback visual ao adicionar no carrinho (toast notifications)
- Transições de estado (loading, success, error)
- Animações de números (contadores)
- Loading spinners customizados

### 3. Integração Shopify

**Storefront API - Queries necessárias:**
- Buscar produtos (com filtros e paginação)
- Buscar produto individual (com variantes)
- Criar checkout
- Adicionar itens ao checkout
- Atualizar checkout
- Buscar coleções
- Verificar disponibilidade em estoque

**Funcionalidades obrigatórias:**
- Sincronização em tempo real com estoque Shopify
- Gestão de variantes (tamanho, cor, etc.)
- Cálculo de frete via Shopify
- Processamento de pagamento via Shopify
- Webhooks para atualização de status (opcional mas recomendado)
- Tratamento de erros da API com fallbacks

### 4. **SEGURANÇA (CRÍTICO)**

#### 4.1 Proteção de Tokens e Credenciais
- **NUNCA expor Storefront API token no frontend**
- Criar API intermediária (Node.js/Express) para proxy das requisições
- Tokens armazenados apenas em variáveis de ambiente no servidor
- HTTPS obrigatório em produção
- Rotação periódica de tokens

#### 4.2 Headers de Segurança
```javascript
// Configurar no servidor Express ou Vercel
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.shopify.com; style-src 'self' 'unsafe-inline';",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}
```

#### 4.3 Proteção contra Ataques
- **XSS**: Sanitização de inputs com DOMPurify
- **CSRF**: Tokens CSRF em formulários críticos (checkout, contato)
- **SQL Injection**: Não aplicável (Shopify API), mas validar inputs sempre
- **Rate Limiting**: Implementar no backend (express-rate-limit)
- **DDoS**: Cloudflare ou similar na frente do site
- **Brute Force**: Limitar tentativas de ações (ex: formulário contato)

#### 4.4 Validação de Dados
```javascript
// Client-side: Yup ou Zod para validação de schemas
// Server-side: Validar TODOS os inputs novamente
- Validar formato de email, telefone, CPF
- Sanitizar strings (remover scripts maliciosos)
- Validar tipos de dados esperados
- Limites de tamanho em inputs
```

#### 4.5 Proteção do Carrinho e Checkout
- Validar estoque no servidor antes de finalizar compra
- Verificar preços no backend (nunca confiar no frontend)
- Implementar idempotência (evitar pedidos duplicados)
- Timeout em requisições longas
- Logs de transações para auditoria

#### 4.6 Armazenamento Seguro
- localStorage: Criptografar dados sensíveis (crypto-js)
- Não armazenar dados de pagamento NUNCA
- Limpar dados sensíveis após logout/checkout
- Session timeout automático

#### 4.7 Proteção de Formulários
- Google reCAPTCHA v3 em formulários de contato
- Honeypot fields (campos invisíveis para detectar bots)
- Validação de email real (verificar formato + domínio existente)

#### 4.8 Monitoramento e Logs
- Logs de erros (Sentry ou similar)
- Monitorar requisições suspeitas
- Alertas para múltiplas falhas de autenticação
- Análise de tráfego anômalo

#### 4.9 Dependências e Updates
```bash
# Auditar vulnerabilidades regularmente
npm audit
npm audit fix

# Manter dependências atualizadas
npm outdated
npm update
```

#### 4.10 CORS e API
```javascript
// Configurar CORS adequadamente no backend
{
  origin: ['https://seusite.com', 'https://www.seusite.com'],
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 86400
}
```

### 5. Performance e SEO
- React Helmet para meta tags dinâmicas
- Lazy loading de componentes (React.lazy + Suspense)
- Code splitting por rota
- Otimização de imagens (WebP, lazy load)
- Preload de fontes
- Service Worker para cache (opcional)
- Sitemap.xml
- Schema markup para produtos (JSON-LD)
- Open Graph tags
- Core Web Vitals otimizados
- Lighthouse score > 90

### 6. Responsividade
- Mobile-first approach
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Menu hamburger animado no mobile
- Touch gestures otimizados
- Carrinho adaptável (drawer no mobile, sidebar no desktop)
- Imagens responsivas (srcset)

## Estrutura de Pastas Sugerida
```
/frontend (React + Vite)
  /src
    /assets
      /images
      /fonts
    /components
      /ui (Button, Input, Card, Modal)
      /layout (Header, Footer, Navigation)
      /product (ProductCard, ProductGallery, VariantSelector)
      /cart (CartDrawer, CartItem, CartSummary)
      /checkout (CheckoutSteps, ShippingForm, PaymentForm)
      /animations (GSAPWrapper, LenisProvider)
    /pages
      /Home
      /Shop
      /ProductDetail
      /Cart
      /Checkout
      /About
      /Contact
    /services
      /api.js (axios config + interceptors)
      /shopify.js (funções que chamam o backend)
    /store (Zustand)
      /cartStore.js
      /checkoutStore.js
    /hooks
      /useCart.js
      /useCheckout.js
      /useProducts.js
    /utils
      /validation.js
      /security.js (sanitização, criptografia)
      /formatters.js
    /styles
      /index.css (Tailwind imports)
    /App.jsx
    /main.jsx
    /router.jsx

/backend (Node.js + Express)
  /src
    /routes
      /products.js
      /checkout.js
      /contact.js
    /controllers
      /shopifyController.js
    /middleware
      /rateLimiter.js
      /validateInput.js
      /csrfProtection.js
      /errorHandler.js
    /services
      /shopifyService.js (GraphQL queries)
    /utils
      /security.js
    /config
      /shopify.js
    /server.js
  /.env (NUNCA commitar)
  /package.json
```

## Diferenciais do Projeto

### Design Premium
- Tipografia elegante (Google Fonts: Playfair Display, Montserrat, Cormorant)
- Paleta de cores sofisticada e coesa
- Espaçamento generoso (whitespace)
- Grid assimétrico em algumas seções
- Imagens em alta qualidade (WebP otimizado)
- Vídeos de background (lazy load)
- Glassmorphism em cards (opcional)

### Animações de Alto Nível
- Entrada escalonada de elementos (stagger)
- Morphing de elementos
- Reveal animations ao scroll
- Magnetic buttons (efeito magnético no hover)
- Cursor customizado (opcional)
- Page transitions fluidas
- Loading states elegantes
- Micro-interações em todos os CTAs

### Checkout Diferenciado
- Multi-step com progress visual claro
- Auto-save de informações em localStorage (criptografado)
- Validação em tempo real (visual feedback)
- Resumo sempre visível (sticky)
- Opção de "guest checkout"
- Múltiplos métodos de pagamento
- Cálculo de frete em tempo real
- Cupons de desconto
- Proteção CSRF

### Segurança Visível ao Usuário
- Selo SSL visível
- Badges de "Compra Segura"
- Políticas de privacidade claras
- Indicadores de conexão segura
- Mensagens de confirmação claras

## Variáveis de Ambiente

### Frontend (.env)
```env
VITE_API_URL=https://api.seusite.com
VITE_RECAPTCHA_SITE_KEY=sua-chave-publica
VITE_SITE_URL=https://seusite.com
```

### Backend (.env) **NUNCA EXPOR**
```env
PORT=5000
NODE_ENV=production
SHOPIFY_STORE_DOMAIN=loja-cliente.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-token-secreto
SHOPIFY_API_VERSION=2024-01
ALLOWED_ORIGINS=https://seusite.com,https://www.seusite.com
RECAPTCHA_SECRET_KEY=sua-chave-secreta
SESSION_SECRET=seu-secret-super-seguro-aqui
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Checklist de Segurança Pré-Deploy
- [ ] Tokens da Shopify NUNCA no frontend
- [ ] HTTPS configurado (SSL/TLS)
- [ ] Headers de segurança implementados
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] Validação server-side em todas as rotas
- [ ] Sanitização de inputs com DOMPurify
- [ ] reCAPTCHA em formulários públicos
- [ ] CSRF tokens em checkout
- [ ] npm audit sem vulnerabilidades HIGH/CRITICAL
- [ ] .env no .gitignore
- [ ] Logs de erro configurados (Sentry)
- [ ] Backup de configurações
- [ ] Testes de penetração básicos
- [ ] Documentação de segurança para cliente

## Entregáveis
1. Código-fonte completo em repositório Git (frontend + backend separados)
2. README detalhado com instruções de setup
3. Frontend deployado na Vercel
4. Backend deployado na Hostinger VPS ou Vercel Functions
5. Documentação de segurança
6. Variáveis de ambiente configuradas
7. Relatório Lighthouse (Performance + Security)
8. Guia de manutenção para cliente

## Testes Obrigatórios
- [ ] Testes de carga (stress testing)
- [ ] Testes de segurança (OWASP Top 10)
- [ ] Testes cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Testes mobile (iOS Safari, Chrome Android)
- [ ] Testes de acessibilidade (WCAG 2.1)
- [ ] Teste de carrinho abandonado
- [ ] Teste de checkout completo
- [ ] Teste de erro de pagamento
- [ ] Teste de estoque zerado

## Observações Importantes
- Todo gerenciamento de produtos/pedidos permanece na Shopify
- Cliente tem plano intermediário Shopify (todas APIs disponíveis)
- Foco em performance E segurança (não sacrificar um pelo outro)
- NUNCA armazenar dados de cartão de crédito
- GDPR/LGPD compliance para dados pessoais
- Testar em diferentes dispositivos e navegadores
- Implementar error boundaries e estados de loading
- Monitoramento contínuo de segurança
- Documentar TODAS as decisões de segurança

## Recursos e Bibliotecas de Segurança
```bash
# Frontend
npm install dompurify crypto-js react-helmet-async

# Backend
npm install helmet express-rate-limit cors express-validator
npm install jsonwebtoken bcryptjs csurf
npm install dotenv
```

---

Claude, preciso que você me ajude a construir este projeto do zero com MÁXIMA ATENÇÃO À SEGURANÇA. Vamos começar pela estrutura do React + Vite, depois a API intermediária Node.js/Express para proteger os tokens da Shopify, configuração dos headers de segurança, e então implementar cada seção com as animações GSAP e Lenis. Segurança é PRIORIDADE #1 junto com UX premium!

Lembre-se: Um e-commerce bonito mas inseguro é um projeto falho. Vamos fazer com excelência em ambos os aspectos!
