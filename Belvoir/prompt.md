# Ajustes e Novas Funcionalidades - E-commerce

## 🔧 Correções Necessárias

### 1. Scroll ao Trocar de Página
**Problema:** Quando navegamos entre páginas, a página não volta automaticamente para o topo.

**Solução:** Implementar scroll to top automático em todas as transições de rota. No React Router, adicionar:
```javascript
// Adicionar componente ScrollToTop ou useEffect que force window.scrollTo(0, 0) em cada mudança de rota
```

### 2. Hover das Imagens - Seção "Explore por Categorias"
**Problema:** O efeito hover nas imagens das categorias está estranho/inconsistente.

**Solução:** Revisar e ajustar o efeito hover para algo mais suave e elegante:
- Transição smooth (transition: all 0.3s ease)
- Scale sutil (transform: scale(1.05))
- Overlay com opacity suave
- Garantir que não quebre o layout

## ✨ Novas Funcionalidades Solicitadas

### 3. Sistema de Login/Autenticação
**Requisito:** Sistema completo de login de usuários.

**Opções de Implementação:**

**Opção A - Usar Customer Accounts da Shopify (RECOMENDADO):**
- Aproveitar o sistema nativo de contas da Shopify
- Integração via Shopify Storefront API
- Usuários podem:
  - Criar conta
  - Fazer login
  - Ver histórico de pedidos
  - Salvar endereços
  - Gerenciar dados pessoais
- Benefícios: Seguro, já integrado, sem necessidade de backend próprio
- **Implementar:**
  - customerCreate mutation
  - customerAccessTokenCreate mutation
  - Páginas: /login, /register, /account (área do cliente)

**Opção B - Login Simplificado (se orçamento for limitado):**
- Apenas email para identificação
- Sem área de cliente completa
- Usado só para checkout mais rápido

**Escolha:** Opção A (completo) ou Opção B (básico)?

### 4. Login Social - Google OAuth
**Requisito:** Login com conta Google.

**Implementação:**
- Integrar Google OAuth 2.0
- Usar biblioteca: `@react-oauth/google` ou `react-google-login`
- Fluxo:
  1. Usuário clica "Entrar com Google"
  2. Autentica via Google
  3. Sistema cria/vincula conta na Shopify com o email do Google
  4. Usuário logado automaticamente

**Nota:** Isso aumenta a complexidade e pode requerer backend adicional para gerenciar tokens do Google + Shopify.

### 5. Sistema de Contato - Email/WhatsApp
**Requisito:** Sistema para envio de mensagens de contato.

**Opções:**

**Para Email:**
- **Opção A:** Integração com EmailJS (sem backend, grátis até 200 emails/mês)
- **Opção B:** Nodemailer via backend Node.js (mais profissional)
- **Opção C:** Serviço da Shopify (se disponível no plano)

**Para WhatsApp:**
- Botão flutuante fixo com link direto: `https://wa.me/5548999999999?text=Olá, gostaria de saber mais sobre...`
- Widget do WhatsApp Business
- Integração com WhatsApp API (mais complexo e pago)

**Formulário de Contato deve ter:**
- Nome
- Email
- Telefone (opcional)
- Mensagem
- Botão "Enviar por Email" e/ou "Enviar pelo WhatsApp"
- reCAPTCHA v3 para proteção

## 📊 Impacto no Escopo e Preço

### Funcionalidades que AUMENTAM o escopo:

| Funcionalidade | Complexidade | Tempo Estimado | Valor Adicional Sugerido |
|----------------|--------------|----------------|--------------------------|
| Sistema de Login completo (Shopify) | Média | +10-15 horas | +R$ 800-1.200 |
| Login com Google OAuth | Alta | +8-12 horas | +R$ 700-1.000 |
| Área do Cliente (pedidos, perfil) | Média-Alta | +15-20 horas | +R$ 1.200-1.500 |
| Sistema de Email (EmailJS) | Baixa | +3-5 horas | +R$ 300-400 |
| Sistema de Email (backend próprio) | Média | +8-10 horas | +R$ 600-800 |
| Integração WhatsApp (botão simples) | Muito Baixa | +1 hora | Incluído |
| Integração WhatsApp API | Alta | +10-15 horas | +R$ 1.000-1.500 |

### Funcionalidades que SÃO AJUSTES (incluídos no escopo original):
- ✅ Scroll to top ao trocar página
- ✅ Correção do hover nas categorias


## 🤔 Perguntas para Definir Escopo Final

**Sobre Login:**
1. Você quer sistema de login completo (usuários podem criar conta e ver histórico) ou só login básico?
2. Login com Google é obrigatório ou opcional?
3. Precisa de área do cliente (dashboard) ou só autenticação?

**Sobre Contato:**
4. Prefere receber mensagens por Email ou WhatsApp? Ou ambos?
5. WhatsApp: só botão simples clicável ou integração completa com API?

**Sobre Orçamento:**
6. Tem orçamento para adicionar essas funcionalidades (R$ 2.000-4.500 a mais) ou prefere versão simplificada?

## 📝 Recomendação para Seu Cliente

**Versão Inteligente (melhor custo-benefício):**

"Posso implementar tudo isso de forma inteligente:

**Login:** Sistema completo usando a própria Shopify (seguro, já integrado, sem custo de manutenção) + Google OAuth para facilitar. Usuários podem criar conta, fazer login, e ver seus pedidos.

**Contato:** 
- Formulário de contato que envia email automaticamente (EmailJS - grátis)
- Botão WhatsApp flutuante que abre conversa direto no seu WhatsApp
- Isso cobre 99% das necessidades sem complicação

