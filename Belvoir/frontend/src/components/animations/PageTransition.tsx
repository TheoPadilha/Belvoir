interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'overlay';
}

// Versão simplificada sem Framer Motion - apenas renderiza os children
// As animações de página não são essenciais e causavam travamento
export const PageTransition = ({ children }: PageTransitionProps) => {
  return <>{children}</>;
};
