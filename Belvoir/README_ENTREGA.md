# Instruções de Entrega e Execução - Belvoir

Este repositório contém a versão otimizada do projeto **Belvoir**, com melhorias de performance, estrutura de código e documentação técnica.

## 🚀 Como Rodar o Projeto Localmente

Para rodar o frontend na sua máquina, siga os passos abaixo:

1.  **Certifique-se de ter o Node.js instalado** (Versão 18 ou superior recomendada).
2.  Abra o terminal na pasta do frontend:
    ```bash
    cd Belvoir/frontend
    ```
3.  **Instale as dependências**:
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
5.  O site estará disponível em `http://localhost:5173`.

## 🛠 O que foi otimizado?

*   **Performance React**: Implementação de `memo` e `Suspense` para carregamento sob demanda.
*   **Animações Suaves**: Otimização de GSAP e Framer Motion para evitar travamentos em dispositivos menos potentes.
*   **Imagens**: Implementação de Lazy Loading e otimização de renderização.
*   **Limpeza de Memória**: Garantia de que animações de scroll e cursores interativos não consumam recursos em excesso.

## 📄 Documentos Adicionais

*   `Relatorio_Performance_Belvoir.md`: Detalhamento técnico das melhorias.
*   `EscopoProjeto.md`: Documentação original das funcionalidades.

---
Projeto preparado para apresentação e deploy de alta performance.
