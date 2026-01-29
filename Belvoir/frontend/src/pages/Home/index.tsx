import { PageTransition } from '../../components/animations';
import {
  HeroEcommerce,
  CategoryGrid,
  FeaturedProducts,
  CollectionsShowcase,
  Testimonials,
  NewsletterSection,
} from '../../components/ecommerce';
import { HorizontalText } from '../../components/ultra-premium';
import { getFeaturedProducts } from '../../data/products';

export const HomePage = () => {
  const featuredProducts = getFeaturedProducts(4);

  return (
    <PageTransition>
        {/* 1. Hero com produto 3D + CTA forte */}
        <HeroEcommerce />

        {/* 2. Grid de Categorias */}
        <CategoryGrid />

        {/* 3. Produtos em destaque (Best Sellers) */}
        <FeaturedProducts
          products={featuredProducts}
          title="Mais Vendidos"
          subtitle="Os relógios favoritos dos nossos clientes"
        />

        {/* 4. Texto Horizontal Infinito (Branding) */}
        <HorizontalText
          text="COLEÇÃO PREMIUM • ELEGÂNCIA ATEMPORAL • DESIGN EXCLUSIVO • TRADIÇÃO SUÍÇA •"
          speed={1}
        />

        {/* 5. Showcase de Coleções com Parallax */}
        <CollectionsShowcase />

        {/* 6. Depoimentos / Social Proof */}
        <Testimonials />

        {/* 7. Newsletter */}
        <NewsletterSection />

        {/* SEÇÃO TEMPORARIAMENTE REMOVIDA - MOVER PARA /SOBRE
        import { BrandTimeline } from '../../components/ultra-premium';
        <BrandTimeline />
        */}
    </PageTransition>
  );
};

export default HomePage;
