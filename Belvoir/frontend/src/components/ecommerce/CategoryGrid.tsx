import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from '../ui/OptimizedImage';
import category1 from '../../assets/images/watches/category-1.jpg';
import category3 from '../../assets/images/watches/category-3.jpg';
import category4 from '../../assets/images/watches/category-4.jpg';

interface Category {
  name: string;
  image: string;
  count: string;
  link: string;
}

const defaultCategories: Category[] = [
  {
    name: 'Belvoir Lux',
    image: category1,
    count: 'Coleção Premium',
    link: '/shop?categoria=lux',
  },
  {
    name: 'Para Ele',
    image: category3,
    count: 'Relógios Masculinos',
    link: '/shop?categoria=masculino',
  },
  {
    name: 'Para Ela',
    image: category4,
    count: 'Relógios Femininos',
    link: '/shop?categoria=feminino',
  },
];

interface CategoryGridProps {
  categories?: Category[];
}

export const CategoryGrid = ({ categories = defaultCategories }: CategoryGridProps) => {
  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
            Categorias
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
            Explore por Categoria
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
            Encontre o relógio perfeito para o seu estilo
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative h-80 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image - Otimizada com lazy loading e placeholder */}
              <OptimizedImage
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                containerClassName="absolute inset-0"
                placeholderColor="bg-secondary-300"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-secondary-300 mb-4">
                  {category.count}
                </p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <span>Ver Coleção</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
