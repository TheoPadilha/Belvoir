import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import collection1 from '../../assets/images/watches/collection-1.jpg';
import collection2 from '../../assets/images/watches/collection-2.jpg';
import collection3 from '../../assets/images/watches/collection-3.jpg';

interface Collection {
  name: string;
  description: string;
  image: string;
  link: string;
}

const defaultCollections: Collection[] = [
  {
    name: 'Coleção Classic',
    description: 'Elegância atemporal',
    image: collection1,
    link: '/shop?categoria=classic',
  },
  {
    name: 'Coleção Lux',
    description: 'Sofisticação suprema',
    image: collection2,
    link: '/shop?categoria=lux',
  },
  {
    name: 'Coleção Sport',
    description: 'Performance e estilo',
    image: collection3,
    link: '/shop?categoria=esportivo',
  },
];

interface CollectionsShowcaseProps {
  collections?: Collection[];
}

export const CollectionsShowcase = ({ collections = defaultCollections }: CollectionsShowcaseProps) => {
  return (
    <section className="py-20 md:py-24 bg-charcoal overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-400 mb-4 block">
            Coleções
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Nossas Coleções
          </h2>
          <p className="text-lg md:text-xl text-secondary-400 max-w-2xl mx-auto">
            Cada coleção conta uma história única
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              to={collection.link}
              className="group relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-secondary-800"
            >
              <img
                src={collection.image}
                alt={collection.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-secondary-300 mb-4">{collection.description}</p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <span>Explorar</span>
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

export default CollectionsShowcase;
