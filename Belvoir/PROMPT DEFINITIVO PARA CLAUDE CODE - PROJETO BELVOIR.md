# PROMPT DEFINITIVO PARA CLAUDE CODE - PROJETO BELVOIR

**Contexto:** Este é um e-commerce de relógios ultra-premium integrado com a Shopify Storefront API. O site apresenta travamentos críticos (lag), imagens quebradas e dados inconsistentes.

**Objetivo:** Realizar uma limpeza técnica profunda e otimização de performance sem perder a estética luxuosa e o scroll elegante.

---

### 1. PERFORMANCE E LIMPEZA (PRIORIDADE MÁXIMA)

- **Remover Bloatware:** Identifique e remova todas as bibliotecas de animação que não estão sendo utilizadas ou que causam lag excessivo (ex: GSAP, Anime.js, Framer Motion em excesso). Substitua por CSS Transitions/Animations nativas onde possível.
- **Desativar Efeitos de Mouse:** Remova completamente o cursor interativo (Spotlight) e fundos que seguem o mouse. Eles estão consumindo CPU/GPU desnecessariamente.
- **Limpeza de Dados:** Remova todos os dados "mockados" (arquivos de teste). O site deve depender 100% da integração com a Shopify. Se não houver dados da Shopify, exiba um estado de "loading" elegante ou uma mensagem amigável.
- **Otimização do /Shop:** Esta página está inutilizável devido ao lag. Implemente:
  - **Virtualização de Lista** ou **Paginação/Infinite Scroll** eficiente.
  - **Lazy Loading** agressivo de imagens.
  - Garanta que o estado da página não trave enquanto os produtos são carregados.

### 2. CORREÇÕES VISUAIS E UI (MOBILE & DESKTOP)

- **Seção Hero (Elegância Atemporal):** No Mobile, ajuste a ordem: **Imagem primeiro, depois o preço/texto**. Atualmente a imagem do relógio não está aparecendo. Corrija o caminho da imagem ou a lógica de renderização.
- **Imagens Quebradas:** Verifique as seções "Explore por Categorias" e "Nossas Coleções". Elas estão exibindo imagens repetidas ou caminhos quebrados. Vincule-as às imagens reais das coleções da Shopify.
- **Seção "Fique por Dentro":** Existe um espaço invisível ou componente quebrado entre esta seção e o Footer. Identifique e arrume esse elemento fantasma.
- **Scroll Elegante:** Mantenha a sensação de "luxo" no scroll, mas garanta que ele seja leve. Se estiver usando Lenis ou similar, configure-o para não conflitar com a performance do navegador.

### 3. INTEGRAÇÕES E RECURSOS

- **Avaliações (Reviews):** O cliente possui avaliações no site antigo (`belvoirrelogios.com`). Verifique se é possível integrar essas avaliações (via metacampos da Shopify ou um arquivo JSON de legado) para que apareçam no catálogo e nas páginas de produto.
- **Sistema de Login:** O sistema de autenticação de usuários não parece estar em produção ou funcional. Revise a lógica e garanta que o fluxo de login/conta do cliente esteja operando corretamente com os dados da Shopify.

### 4. DIRETRIZES TÉCNICAS PARA O CLAUDE

- **Não invente dados:** Se uma imagem não vier da Shopify, use um placeholder elegante da marca.
- **Código Limpo:** Priorize componentes funcionais e hooks simples. Evite re-renderizações desnecessárias (use `useMemo` e `useCallback` onde for crítico).
- **Mobile First:** Todas as correções visuais devem ser testadas prioritariamente para a experiência mobile.

---

**Instrução Final:** "Claude, analise o projeto inteiro, identifique os gargalos de performance e aplique estas correções de uma vez. O foco é um site RÁPIDO, FLUIDO e PROFISSIONAL."
