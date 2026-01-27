# Melhorias na Página de Conta (/conta) - Design Elegante + Animações

## 🎨 PROBLEMAS IDENTIFICADOS NA PÁGINA ATUAL

### Problemas Visuais:

1. ❌ Layout genérico e sem personalidade
2. ❌ Sidebar com fundo preto muito pesado
3. ❌ Cards de resumo (pedidos, endereços, email) sem hierarquia visual
4. ❌ Tipografia sem refinamento
5. ❌ Espaçamentos inconsistentes
6. ❌ Sem animações de entrada
7. ❌ Ícones simples demais
8. ❌ Cores sem harmonia com o resto do site
9. ❌ Falta de feedback visual nas interações
10. ❌ Seção de pedidos recentes sem destaque

### Problemas de UX:

1. ❌ Menu lateral não indica visualmente a seção ativa
2. ❌ Falta breadcrumbs ou indicação de localização
3. ❌ Cards de estatísticas pouco informativos
4. ❌ Botão "Ver todos" dos pedidos sem destaque
5. ❌ Falta estados de hover elaborados

---

## ✨ MELHORIAS A IMPLEMENTAR

### 1. **Layout Geral - Redesign Completo**

**Estrutura Nova:**

```jsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
  {/* Header fixo já existe */}

  <div className="container mx-auto px-4 py-8 pt-28">
    {" "}
    {/* pt-28 = espaço pro header fixo */}
    {/* Breadcrumb elegante */}
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <a
            href="/"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Home
          </a>
        </li>
        <li>
          <span className="text-gray-400">/</span>
        </li>
        <li>
          <span className="text-gray-900 font-medium">Minha Conta</span>
        </li>
      </ol>
    </nav>
    {/* Header da página */}
    <div className="mb-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
        Minha Conta
      </h1>
      <p className="text-gray-600 text-lg">
        Olá, Usuário! Gerencie suas informações e pedidos.
      </p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - 3 colunas */}
      <aside className="lg:col-span-3">{/* Menu lateral redesenhado */}</aside>

      {/* Conteúdo principal - 9 colunas */}
      <main className="lg:col-span-9">
        {/* Cards de estatísticas */}
        {/* Pedidos recentes */}
        {/* Outras seções */}
      </main>
    </div>
  </div>
</div>
```

---

### 2. **Sidebar - Menu Lateral Elegante**

**Substituir o menu preto atual por:**

```jsx
<aside className="lg:col-span-3">
  <nav className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
    {/* Avatar/Perfil */}
    <div className="mb-8 text-center pb-6 border-b border-gray-100">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-2xl font-bold">
        U
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">Usuário</h3>
      <p className="text-sm text-gray-500">Email@exemplo.com</p>
    </div>

    {/* Menu Items */}
    <ul className="space-y-2">
      <li>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-900 text-white transition-all duration-300 hover:shadow-lg">
          <svg className="w-5 h-5" />
          <span className="font-medium">Visão Geral</span>
        </button>
      </li>

      <li>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300">
          <svg className="w-5 h-5" />
          <span className="font-medium">Meus Pedidos</span>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
            1
          </span>
        </button>
      </li>

      <li>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300">
          <svg className="w-5 h-5" />
          <span className="font-medium">Endereços</span>
        </button>
      </li>

      <li>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300">
          <svg className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
      </li>
    </ul>

    {/* Botão Sair */}
    <button className="w-full mt-8 pt-6 border-t border-gray-100 flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300">
      <svg className="w-5 h-5" />
      <span className="font-medium">Sair</span>
    </button>
  </nav>
</aside>
```

**Animação com Anime.js:**

```javascript
import anime from "animejs";

useEffect(() => {
  // Animar entrada da sidebar
  anime({
    targets: "aside nav",
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: 800,
    easing: "easeOutExpo",
    delay: 200,
  });

  // Animar menu items (stagger)
  anime({
    targets: "aside nav ul li",
    translateX: [-30, 0],
    opacity: [0, 1],
    duration: 600,
    easing: "easeOutExpo",
    delay: anime.stagger(100, { start: 400 }),
  });
}, []);
```

---

### 3. **Cards de Estatísticas - Redesign Premium**

**Substituir os 3 cards simples atuais por:**

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  {/* Card 1 - Pedidos */}
  <div className="stat-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        <svg className="w-6 h-6" /> {/* Ícone de pacote */}
      </div>
      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
        +1 novo
      </span>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-2">1</h3>
    <p className="text-gray-600 font-medium">Pedidos Ativos</p>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <a
        href="#"
        className="text-sm text-blue-600 font-medium flex items-center group-hover:translate-x-2 transition-transform"
      >
        Ver detalhes
        <svg className="w-4 h-4 ml-1" />
      </a>
    </div>
  </div>

  {/* Card 2 - Endereços */}
  <div className="stat-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        <svg className="w-6 h-6" /> {/* Ícone de localização */}
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-2">0</h3>
    <p className="text-gray-600 font-medium">Endereços Salvos</p>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <a
        href="#"
        className="text-sm text-purple-600 font-medium flex items-center group-hover:translate-x-2 transition-transform"
      >
        Adicionar endereço
        <svg className="w-4 h-4 ml-1" />
      </a>
    </div>
  </div>

  {/* Card 3 - Email Verificado */}
  <div className="stat-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        <svg className="w-6 h-6" /> {/* Ícone de email/check */}
      </div>
      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center">
        <svg className="w-3 h-3 mr-1" /> {/* check icon */}
        Verificado
      </span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">u.Email</h3>
    <p className="text-gray-600 font-medium">Email da Conta</p>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <a
        href="#"
        className="text-sm text-green-600 font-medium flex items-center group-hover:translate-x-2 transition-transform"
      >
        Editar perfil
        <svg className="w-4 h-4 ml-1" />
      </a>
    </div>
  </div>
</div>
```

**Animação com Anime.js:**

```javascript
useEffect(() => {
  // Animar entrada dos cards (stagger)
  anime({
    targets: ".stat-card",
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 800,
    easing: "easeOutExpo",
    delay: anime.stagger(150, { start: 600 }),
  });
}, []);

// Hover effect adicional
const handleCardHover = (e) => {
  anime({
    targets: e.currentTarget,
    scale: 1.02,
    duration: 300,
    easing: "easeOutQuad",
  });
};
```

---

### 4. **Seção Pedidos Recentes - Premium**

**Redesign completo:**

```jsx
<section className="bg-white rounded-2xl shadow-lg p-8">
  {/* Header da seção */}
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
        Pedidos Recentes
      </h2>
      <p className="text-gray-600">Acompanhe seus últimos pedidos</p>
    </div>
    <a
      href="/pedidos"
      className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      Ver Todos
    </a>
  </div>

  {/* Card do pedido */}
  <div className="order-card border border-gray-200 rounded-xl p-6 hover:border-gray-900 transition-all duration-300 hover:shadow-xl">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-lg font-bold text-gray-900">#BV-2024-001</h3>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Entregue
          </span>
        </div>
        <p className="text-sm text-gray-500">15 de janeiro de 2024</p>
      </div>

      <button className="text-gray-400 hover:text-gray-900 transition-colors">
        <svg className="w-5 h-5" /> {/* ícone de mais opções */}
      </button>
    </div>

    {/* Detalhes do pedido */}
    <div className="border-t border-gray-100 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total do Pedido</p>
          <p className="text-2xl font-bold text-gray-900">R$ 24.900,00</p>
        </div>

        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300">
            Ver Detalhes
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-300 flex items-center">
            <svg className="w-4 h-4 mr-2" /> {/* ícone de redo */}
            Rastrear
          </button>
        </div>
      </div>
    </div>

    {/* Timeline de entrega (opcional - mais elegante) */}
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-2" />
          <span className="font-medium">Pedido confirmado</span>
        </div>
        <div className="flex-1 h-0.5 bg-green-200 mx-4"></div>
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-2" />
          <span className="font-medium">Em transporte</span>
        </div>
        <div className="flex-1 h-0.5 bg-green-200 mx-4"></div>
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-2" />
          <span className="font-medium">Entregue</span>
        </div>
      </div>
    </div>
  </div>

  {/* Se não houver pedidos */}
  {/* <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
      <svg className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h3>
    <p className="text-gray-600 mb-6">Comece a explorar nossa coleção</p>
    <a href="/shop" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300">
      Ver Coleção
    </a>
  </div> */}
</section>
```

**Animação:**

```javascript
useEffect(() => {
  // Animar seção de pedidos
  anime({
    targets: "section",
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 800,
    easing: "easeOutExpo",
    delay: 1000,
  });

  // Animar card do pedido
  anime({
    targets: ".order-card",
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 600,
    easing: "easeOutExpo",
    delay: 1200,
  });
}, []);
```

---

### 5. **Tipografia e Espaçamentos Refinados**

**Configurar no Tailwind (tailwind.config.js):**

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      boxShadow: {
        elegant: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
        "elegant-lg": "0 20px 60px -15px rgba(0, 0, 0, 0.15)",
      },
    },
  },
};
```

---

### 6. **Animações de Página (Swup.js)**

**Adicionar transição ao entrar na página /conta:**

```jsx
<div id="swup" className="transition-fade">
  <ContaPage />
</div>
```

**CSS:**

```css
.transition-fade {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  opacity: 1;
  transform: translateY(0);
}

html.is-animating .transition-fade {
  opacity: 0;
  transform: translateY(20px);
}
```

---

### 7. **Micro-interações Adicionais**

**Botões com efeito ripple:**

```jsx
const RippleButton = ({ children, ...props }) => {
  const handleClick = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className="relative overflow-hidden"
    >
      {children}
    </button>
  );
};
```

**CSS do ripple:**

```css
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ Estrutura e Layout

- [ ] Adicionar breadcrumb no topo
- [ ] Corrigir padding-top para evitar sobreposição com header (pt-28)
- [ ] Implementar grid responsivo (12 colunas)
- [ ] Background gradient sutil (from-gray-50 to-gray-100)

### ✅ Sidebar

- [ ] Redesign completo (fundo branco, bordas arredondadas)
- [ ] Adicionar seção de perfil com avatar
- [ ] Refazer menu items (ícones + texto + badges)
- [ ] Estado ativo visual (bg preto, texto branco)
- [ ] Hover states suaves
- [ ] Botão "Sair" em vermelho no final
- [ ] Animação de entrada com Anime.js (translateX + opacity)
- [ ] Stagger effect nos menu items
- [ ] Tornar sticky (sticky top-24)

### ✅ Cards de Estatísticas

- [ ] Redesign completo (sombras, bordas arredondadas)
- [ ] Ícones com gradiente em círculos
- [ ] Badges de status (novo, verificado)
- [ ] Números grandes e destacados
- [ ] Links de ação no rodapé de cada card
- [ ] Hover effect (scale + shadow)
- [ ] Animação de entrada com stagger (Anime.js)
- [ ] Responsividade (grid 1 col mobile, 3 cols desktop)

### ✅ Seção Pedidos Recentes

- [ ] Header da seção com título + descrição
- [ ] Botão "Ver Todos" estilizado
- [ ] Card de pedido redesenhado
- [ ] Badge de status com animação pulse
- [ ] Timeline de entrega visual
- [ ] Botões de ação (Ver Detalhes + Rastrear)
- [ ] Estado vazio (quando não há pedidos)
- [ ] Animação de entrada (Anime.js)
- [ ] Hover effect no card

### ✅ Tipografia

- [ ] Importar Google Fonts (Playfair Display + Inter)
- [ ] Aplicar font-serif nos títulos principais
- [ ] Aplicar font-sans no corpo do texto
- [ ] Hierarquia clara (h1, h2, h3, p)
- [ ] Pesos variados (regular, medium, bold)

### ✅ Animações

- [ ] Swup.js para transição de página
- [ ] Anime.js na sidebar (entrada + stagger)
- [ ] Anime.js nos cards (entrada + stagger)
- [ ] Anime.js na seção de pedidos
- [ ] Ripple effect nos botões principais
- [ ] Hover effects suaves (scale, shadow, translate)
- [ ] Loading states animados (se aplicável)

### ✅ Cores e Sombras

- [ ] Paleta consistente (grays + accent colors)
- [ ] Sombras elegantes (shadow-lg, shadow-xl)
- [ ] Gradientes sutis (backgrounds, ícones)
- [ ] Estados de hover bem definidos
- [ ] Badges coloridos (green, blue, purple)

### ✅ Responsividade

- [ ] Mobile: sidebar vira dropdown/modal
- [ ] Mobile: cards de stats em coluna única
- [ ] Tablet: ajustar grid columns
- [ ] Desktop: layout em 2 colunas (sidebar + content)
- [ ] Testar em breakpoints: sm, md, lg, xl

### ✅ Acessibilidade

- [ ] Contraste adequado (WCAG AA)
- [ ] Focus states visíveis
- [ ] Labels em botões e inputs
- [ ] Navegação por teclado funcional
- [ ] aria-labels onde necessário

---

## 🚨 ITENS QUE FALTAM DO PROMPT ANTERIOR

### Ainda NÃO Implementadas:

1. ❌ **Swup.js** - Transições entre páginas (precisa configurar no router principal)
2. ❌ **Image Sequence (Apple-style)** - Animação de scroll com frames (homepage, não /conta)
3. ❌ **GSAP ScrollTrigger geral** - Parallax e scroll animations (outras páginas)
4. ❌ **Lenis Smooth Scroll** - Scroll suave global (configurar no App.jsx)
5. ❌ **Magnetic Buttons** - Botões que "atraem" cursor (opcional, polish)
6. ❌ **Cursor Customizado** - Cursor que segue o mouse (opcional, polish)

### Parcialmente Implementadas:

- ⚠️ **Anime.js** - Implementar APENAS na página /conta (precisa aplicar em TODAS as páginas)

---

## 💡 PRÓXIMOS PASSOS RECOMENDADOS

**Prioridade 1 (página /conta):**

1. Implementar novo layout com grid 12 colunas ✅
2. Redesign sidebar + animações Anime.js ✅
3. Redesign cards de estatísticas + animações ✅
4. Redesign seção pedidos recentes ✅
5. Adicionar Swup.js para transição ao entrar/sair da página ✅

**Prioridade 2 (global):** 6. Configurar Lenis Smooth Scroll (site todo) 7. Aplicar Swup.js em TODAS as transições de rota 8. Adicionar GSAP ScrollTrigger em outras páginas (homepage, shop, produto)

**Prioridade 3 (polish):** 9. Image Sequence na homepage (hero section) 10. Magnetic buttons nos CTAs principais 11. Cursor customizado (opcional)

---

## 📐 WIREFRAME VISUAL DA NOVA PÁGINA /CONTA

```
┌────────────────────────────────────────────────────────────┐
│                     HEADER FIXO                             │
└────────────────────────────────────────────────────────────┘

    Home / Minha Conta  ← breadcrumb

    Minha Conta  ← h1
    Olá, Usuário! Gerencie suas informações e pedidos.

┌─────────────────┐  ┌──────────────────────────────────────┐
│                 │  │                                       │
│   ┌───────┐     │  │  ┌──────┐  ┌──────┐  ┌──────┐      │
│   │ Avatar│     │  │  │ 📦 1 │  │ 📍 0 │  │ ✉️ ✓ │      │
│   │   U   │     │  │  │Pedido│  │Ender.│  │Email │      │
│   └───────┘     │  │  └──────┘  └──────┘  └──────┘      │
│   Usuário       │  │                                       │
│   email@...     │  │  ┌─────────────────────────────────┐│
│                 │  │  │  Pedidos Recentes   [Ver Todos] ││
│ ┌─────────────┐ │  │  │                                 ││
│ │●Visão Geral │ │  │  │  ┌──────────────────────────┐  ││
│ └─────────────┘ │  │  │  │ #BV-2024-001    ✓Entregue│  ││
│ ┌─────────────┐ │  │  │  │ 15 jan 2024              │  ││
│ │ Meus Pedidos│ │  │  │  │ R$ 24.900,00   [Rastrear]│  ││
│ └─────────────┘ │  │  │  └──────────────────────────┘  ││
│ ┌─────────────┐ │  │  └─────────────────────────────────┘│
│ │  Endereços  │ │  │                                       │
│ └─────────────┘ │  └──────────────────────────────────────┘
│ ┌─────────────┐ │
│ │Configurações│ │
│ └─────────────┘ │
│                 │
│ ─────────────── │
│ [❌ Sair]       │
└─────────────────┘
```

---

## 🎨 PALETA DE CORES SUGERIDA

```css
/* Principais */
--primary-black: #111827; /* Gray-900 */
--primary-white: #ffffff;
--background: #f9fafb; /* Gray-50 */

/* Secundárias */
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-600: #4b5563;
--gray-700: #374151;

/* Accents */
--blue: #3b82f6;
--purple: #8b5cf6;
--green: #10b981;
--red: #ef4444;

/* Gradientes */
--gradient-blue: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
--gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
--gradient-green: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

---

## 📦 COMPONENTES REUTILIZÁVEIS A CRIAR

```
/src/components/conta/
  ├── ContaSidebar.jsx        (sidebar com menu)
  ├── ContaStatCard.jsx       (card de estatística reutilizável)
  ├── PedidoCard.jsx          (card individual de pedido)
  ├── PedidoTimeline.jsx      (timeline de status)
  └── EmptyState.jsx          (estado vazio genérico)
```

---

Pronto! Prompt completo e detalhado. Manda pro Claude Code que ele vai arrasar! 🚀✨
