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
import { useProducts, useCategories } from '../../hooks/useProducts';

export const HomePage = () => {
  const { products, isLoading } = useProducts(8);
  const { categories } = useCategories();

  // Pegar os 4 primeiros produtos como "destaques"
  const featuredProducts = products.slice(0, 4);

  // Produto principal para o Hero (primeiro produto)
  const heroProduct = products[0];

  // Mapear categorias do Shopify para o formato do CategoryGrid
  const categoryImages: Record<string, string> = {
    'Feminino': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    'Masculino': 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80',
    'Vintage': 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80',
    'Minimalista': 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&q=80',
    'Luxo': 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80',
    'Esportivo': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
  };

  const mappedCategories = categories.slice(0, 4).map((cat) => ({
    name: cat,
    image: categoryImages[cat] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    count: `Ver coleção`,
    link: `/shop?categoria=${cat.toLowerCase()}`,
  }));

  // Mapear coleções baseadas nas categorias
  const collectionImages: Record<string, { image: string; description: string }> = {
    'Vintage': { image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80', description: 'Clássicos reinventados' },
    'Minimalista': { image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', description: 'Elegância discreta' },
    'Esportivo': { image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80', description: 'Performance e estilo' },
    'Luxo': { image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80', description: 'Sofisticação absoluta' },
    'Feminino': { image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', description: 'Elegância feminina' },
    'Masculino': { image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80', description: 'Estilo masculino' },
  };

  const mappedCollections = categories.slice(0, 3).map((cat) => ({
    name: `Coleção ${cat}`,
    description: collectionImages[cat]?.description || 'Descubra mais',
    image: collectionImages[cat]?.image || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    link: `/shop?categoria=${cat.toLowerCase()}`,
  }));

  return (
    <PageTransition>
        {/* 1. Hero com produto 3D + CTA forte */}
        <HeroEcommerce product={!isLoading && heroProduct ? heroProduct : undefined} />

        {/* 2. Grid de Categorias */}
        <CategoryGrid categories={mappedCategories.length > 0 ? mappedCategories : undefined} />

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
        <CollectionsShowcase collections={mappedCollections.length > 0 ? mappedCollections : undefined} />

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
