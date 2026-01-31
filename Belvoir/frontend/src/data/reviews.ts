import type { Review, ReviewSummary } from '../types';

// Reviews reais dos clientes Belvoir
export const reviews: Review[] = [
  // Reviews reais do site
  {
    id: 'rev_001',
    productId: 'all',
    customerName: 'Paulo Henrique',
    rating: 5,
    title: 'Entrega super rápida!',
    comment: 'Chegou em 1 dia pra mim, sou aqui da região de Santa Catarina, extrema qualidade! Recomendo!',
    verified: true,
    helpful: 45,
    createdAt: '2024-11-20',
  },
  {
    id: 'rev_002',
    productId: 'all',
    customerName: 'Arthur Ferreira',
    rating: 5,
    title: 'Qualidade excepcional',
    comment: 'Comprei e tenho só elogios! Garantia de 3 meses, extrema qualidade, lindo! Recomendo, sou de São Paulo, e chegou muito rápido.',
    verified: true,
    helpful: 38,
    createdAt: '2024-11-18',
  },
  {
    id: 'rev_003',
    productId: 'all',
    customerName: 'Gustavo Diniz',
    rating: 5,
    title: 'Relógio incrível!',
    comment: 'Sou de São Paulo, o relógio é incrível, e chegou super rápido! Recomendo, qualidade excelente!',
    verified: true,
    helpful: 32,
    createdAt: '2024-11-15',
  },
  {
    id: 'rev_004',
    productId: 'all',
    customerName: 'Arthur',
    rating: 5,
    title: 'Superou expectativas',
    comment: 'Estiloso e clássico, de verdade, superou minhas expectativas.',
    verified: true,
    helpful: 28,
    createdAt: '2024-11-12',
  },
  {
    id: 'rev_005',
    productId: 'all',
    customerName: 'Jackson Germer',
    rating: 5,
    title: 'Ótimo custo benefício',
    comment: 'Excelente relógio! Elegante, versátil, leve e de ótimo custo benefício! Super recomendo a compra.',
    verified: true,
    helpful: 41,
    createdAt: '2024-11-10',
  },
  {
    id: 'rev_006',
    productId: 'all',
    customerName: 'Jackson',
    rating: 5,
    title: 'Surreal!',
    comment: 'Superou minhas expectativas! Surreal, caixa de couro, e alta qualidade do material!',
    verified: true,
    helpful: 35,
    createdAt: '2024-11-08',
  },
  {
    id: 'rev_007',
    productId: 'all',
    customerName: 'Thiago Freitas',
    rating: 5,
    title: 'Incrível',
    comment: 'Surreal, superou minhas expectativas!',
    verified: true,
    helpful: 22,
    createdAt: '2024-11-05',
  },
  {
    id: 'rev_008',
    productId: 'all',
    customerName: 'Rafael Klein',
    rating: 5,
    title: 'Combina com tudo',
    comment: 'Estiloso! Clássico e combina com tudo!',
    verified: true,
    helpful: 19,
    createdAt: '2024-11-02',
  },
  {
    id: 'rev_009',
    productId: 'all',
    customerName: 'Thiago M.',
    rating: 5,
    title: 'Perfeito para mergulho!',
    comment: 'Uso para mergulho há 6 meses, já levei até 45 metros e funciona perfeitamente. A luneta cerâmica não tem um arranhão sequer. Excelente investimento.',
    images: ['/images/review-watch-1.jpg'],
    verified: true,
    helpful: 52,
    createdAt: '2024-11-07',
  },
  {
    id: 'rev_010',
    productId: 'all',
    customerName: 'Alexandre N.',
    rating: 5,
    title: 'Herança para gerações',
    comment: 'Comprei pensando em deixar para meu filho. Uma peça assim atravessa gerações. Qualidade suíça impecável.',
    verified: true,
    helpful: 48,
    createdAt: '2024-08-27',
  },
  {
    id: 'rev_011',
    productId: 'all',
    customerName: 'Gabriela M.',
    rating: 5,
    title: 'Absolutamente deslumbrante',
    comment: 'O mostrador em madrepérola é de tirar o fôlego. A fase lunar adiciona um charme especial. Uso como meu relógio principal para eventos.',
    images: ['/images/review-watch-2.jpg'],
    verified: true,
    helpful: 44,
    createdAt: '2024-10-31',
  },
  {
    id: 'rev_012',
    productId: 'all',
    customerName: 'Carlos Eduardo',
    rating: 5,
    title: 'Melhor compra do ano',
    comment: 'Pesquisei muito antes de comprar e não me arrependo. O acabamento é impecável, o peso na medida certa. Entrega foi rápida e bem embalado.',
    verified: true,
    helpful: 36,
    createdAt: '2024-10-25',
  },
  {
    id: 'rev_013',
    productId: 'all',
    customerName: 'Fernando Santos',
    rating: 5,
    title: 'Presente perfeito',
    comment: 'Comprei para presentear meu pai no aniversário. Ele ficou emocionado! A caixa de apresentação é linda e o relógio mais ainda.',
    verified: true,
    helpful: 29,
    createdAt: '2024-10-18',
  },
  {
    id: 'rev_014',
    productId: 'all',
    customerName: 'Rodrigo Lima',
    rating: 5,
    title: 'Visual impressionante',
    comment: 'O relógio é ainda mais bonito ao vivo. As fotos não fazem justiça. Material de primeira qualidade.',
    verified: true,
    helpful: 25,
    createdAt: '2024-10-10',
  },
  {
    id: 'rev_015',
    productId: 'all',
    customerName: 'Marcelo Costa',
    rating: 5,
    title: 'Atendimento excelente',
    comment: 'Além do relógio ser incrível, o atendimento foi nota 10. Tiraram todas as minhas dúvidas antes da compra.',
    verified: true,
    helpful: 21,
    createdAt: '2024-09-28',
  },
];

// Calculate review summaries dynamically
export const calculateReviewSummary = (productId: string): ReviewSummary => {
  const productReviews = reviews.filter(r => r.productId === productId || r.productId === 'all');

  if (productReviews.length === 0) {
    return {
      productId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = productReviews.length;
  const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingDistribution = {
    5: productReviews.filter(r => r.rating === 5).length,
    4: productReviews.filter(r => r.rating === 4).length,
    3: productReviews.filter(r => r.rating === 3).length,
    2: productReviews.filter(r => r.rating === 2).length,
    1: productReviews.filter(r => r.rating === 1).length,
  };

  return {
    productId,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution,
  };
};

// Helper functions
export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews
    .filter(r => r.productId === productId || r.productId === 'all')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getReviewSummaryByProductId = (productId: string): ReviewSummary => {
  return calculateReviewSummary(productId);
};

export const getTopReviews = (limit: number = 6): Review[] => {
  return [...reviews]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit);
};

export const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
