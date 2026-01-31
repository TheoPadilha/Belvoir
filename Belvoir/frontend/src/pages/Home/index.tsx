import {
  HeroEcommerce,
  CategoryGrid,
  FeaturedProducts,
  CollectionsShowcase,
  Testimonials,
  NewsletterSection,
} from '../../components/ecommerce';
import { useProducts } from '../../hooks/useProducts';

export const HomePage = () => {
  const { products, isLoading } = useProducts(8);

  // Pegar os 4 primeiros produtos como "destaques"
  const featuredProducts = products.slice(0, 4);

  // Produto principal para o Hero (primeiro produto)
  const heroProduct = products[0];

  return (
    <div>
        {/* 1. Hero com produto + CTA forte - passa isLoading para mostrar loading */}
        <HeroEcommerce
          product={heroProduct}
          isLoading={isLoading}
        />

        {/* Só mostra o resto do conteúdo depois que os produtos carregaram */}
        {!isLoading && products.length > 0 && (
          <>
            {/* 2. Grid de Categorias - usa imagens locais por padrão */}
            <CategoryGrid />

            {/* 3. Produtos em destaque (Best Sellers) */}
            <FeaturedProducts
              products={featuredProducts}
              title="Mais Vendidos"
              subtitle="Os relógios favoritos dos nossos clientes"
            />

            {/* 4. Showcase de Coleções - usa imagens locais por padrão */}
            <CollectionsShowcase />

            {/* 5. Depoimentos / Social Proof */}
            <Testimonials />

            {/* 6. Newsletter */}
            <NewsletterSection />
          </>
        )}
    </div>
  );
};

export default HomePage;
