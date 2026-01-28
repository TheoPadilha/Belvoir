import type { Review, ReviewSummary } from '../types';

// Avatares placeholder
const AVATAR_1 = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';
const AVATAR_2 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80';
const AVATAR_3 = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80';
const AVATAR_4 = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80';
const AVATAR_5 = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80';
const AVATAR_6 = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80';

export const reviews: Review[] = [
  // Reviews for prod_001 - Belvoir Heritage Chronograph
  {
    id: 'rev_001',
    productId: 'prod_001',
    customerName: 'Ricardo M.',
    customerAvatar: AVATAR_1,
    rating: 5,
    title: 'Simplesmente espetacular!',
    comment: 'Comprei este cronógrafo para presentear a mim mesmo após uma conquista importante. A qualidade do acabamento é impecável, cada detalhe foi pensado com cuidado. O movimento automático é suave e preciso. Recomendo fortemente para quem busca um relógio de luxo com excelente custo-benefício.',
    verified: true,
    helpful: 24,
    createdAt: '2024-11-15',
  },
  {
    id: 'rev_002',
    productId: 'prod_001',
    customerName: 'Fernando A.',
    customerAvatar: AVATAR_2,
    rating: 5,
    title: 'Melhor compra que já fiz',
    comment: 'Estava em dúvida entre várias marcas, mas o Heritage Chronograph me conquistou. O mostrador azul é ainda mais bonito pessoalmente. A pulseira de couro marrom envelheceu lindamente após 3 meses de uso diário.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'],
    verified: true,
    helpful: 18,
    createdAt: '2024-10-28',
  },
  {
    id: 'rev_003',
    productId: 'prod_001',
    customerName: 'Mariana S.',
    customerAvatar: AVATAR_3,
    rating: 4,
    title: 'Excelente qualidade',
    comment: 'Comprei de presente para meu marido e ele adorou. A única observação é que o relógio é um pouco pesado, mas nada que incomode. O atendimento da Belvoir foi excepcional!',
    verified: true,
    helpful: 12,
    createdAt: '2024-09-14',
  },
  {
    id: 'rev_004',
    productId: 'prod_001',
    customerName: 'Carlos E.',
    customerAvatar: AVATAR_4,
    rating: 5,
    title: 'Peça de colecionador',
    comment: 'Tenho mais de 20 relógios na minha coleção e o Heritage entrou direto para o top 3. O acabamento rivaliza com marcas muito mais caras. O packaging também é luxuoso.',
    verified: true,
    helpful: 31,
    createdAt: '2024-08-22',
  },

  // Reviews for prod_002 - Belvoir Classique Dress Watch
  {
    id: 'rev_005',
    productId: 'prod_002',
    customerName: 'André L.',
    customerAvatar: AVATAR_6,
    rating: 5,
    title: 'Elegância pura',
    comment: 'Perfeito para eventos formais. O mostrador guilloché é hipnotizante sob a luz. Muito confortável graças à espessura ultra-fina.',
    verified: true,
    helpful: 15,
    createdAt: '2024-11-02',
  },
  {
    id: 'rev_006',
    productId: 'prod_002',
    customerName: 'Juliana P.',
    customerAvatar: AVATAR_5,
    rating: 5,
    title: 'Presente perfeito',
    comment: 'Dei de presente de casamento para meu noivo. Ele usa todos os dias e sempre recebe elogios. A qualidade é notável.',
    verified: true,
    helpful: 9,
    createdAt: '2024-10-15',
  },
  {
    id: 'rev_007',
    productId: 'prod_002',
    customerName: 'Roberto F.',
    rating: 4,
    title: 'Muito bom, mas delicado',
    comment: 'O relógio é lindo e elegante, mas a resistência à água de apenas 30m me preocupa um pouco. Uso apenas em ocasiões especiais.',
    verified: true,
    helpful: 7,
    createdAt: '2024-09-30',
  },

  // Reviews for prod_003 - Belvoir Diver Professional
  {
    id: 'rev_008',
    productId: 'prod_003',
    customerName: 'Thiago M.',
    customerAvatar: AVATAR_1,
    rating: 5,
    title: 'Perfeito para mergulho!',
    comment: 'Uso para mergulho há 6 meses, já levei até 45 metros e funciona perfeitamente. A luneta cerâmica não tem um arranhão sequer. Excelente investimento.',
    images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&q=80'],
    verified: true,
    helpful: 42,
    createdAt: '2024-11-08',
  },
  {
    id: 'rev_009',
    productId: 'prod_003',
    customerName: 'Paulo R.',
    customerAvatar: AVATAR_2,
    rating: 5,
    title: 'Robusto e elegante',
    comment: 'Não faço mergulho mas queria um relógio resistente para o dia a dia. O Diver Professional é perfeito - aguenta qualquer situação mas ainda é elegante o suficiente para o escritório.',
    verified: true,
    helpful: 28,
    createdAt: '2024-10-20',
  },
  {
    id: 'rev_010',
    productId: 'prod_003',
    customerName: 'Lucas B.',
    customerAvatar: AVATAR_4,
    rating: 4,
    title: 'Ótimo custo-benefício',
    comment: 'Comparei com outras marcas famosas de diver e o Belvoir oferece qualidade similar por um preço bem mais acessível. A única coisa que senti falta foi uma pulseira de aço inclusa.',
    verified: true,
    helpful: 16,
    createdAt: '2024-09-05',
  },

  // Reviews for prod_004 - Belvoir Tourbillon Reserve
  {
    id: 'rev_011',
    productId: 'prod_004',
    customerName: 'Henrique C.',
    customerAvatar: AVATAR_6,
    rating: 5,
    title: 'Uma obra de arte',
    comment: 'Após anos colecionando, finalmente adquiri um tourbillon. A peça é simplesmente extraordinária. O movimento é mesmerizante e o acabamento impecável. Vale cada centavo.',
    verified: true,
    helpful: 56,
    createdAt: '2024-10-30',
  },
  {
    id: 'rev_012',
    productId: 'prod_004',
    customerName: 'Eduardo S.',
    rating: 5,
    title: 'Investimento certeiro',
    comment: 'Comprei como investimento e também para uso. A valorização dessas peças é garantida. A Belvoir está no caminho certo.',
    verified: true,
    helpful: 23,
    createdAt: '2024-08-15',
  },

  // Reviews for prod_005 - Belvoir GMT Traveler
  {
    id: 'rev_013',
    productId: 'prod_005',
    customerName: 'Marcos V.',
    customerAvatar: AVATAR_1,
    rating: 5,
    title: 'Companheiro de viagem',
    comment: 'Viajo muito a trabalho entre Brasil e Europa. O GMT é perfeito para acompanhar os dois fusos. O ajuste rápido da hora local é muito prático.',
    verified: true,
    helpful: 19,
    createdAt: '2024-11-12',
  },
  {
    id: 'rev_014',
    productId: 'prod_005',
    customerName: 'Ana C.',
    customerAvatar: AVATAR_3,
    rating: 4,
    title: 'Bonito e funcional',
    comment: 'Comprei para meu marido que viaja muito. Ele adorou! Apenas achei que poderia ter mais opções de cores.',
    verified: true,
    helpful: 8,
    createdAt: '2024-10-05',
  },

  // Reviews for prod_006 - Belvoir Moonphase Elite
  {
    id: 'rev_015',
    productId: 'prod_006',
    customerName: 'Gabriela M.',
    customerAvatar: AVATAR_5,
    rating: 5,
    title: 'Absolutamente deslumbrante',
    comment: 'O mostrador em madrepérola é de tirar o fôlego. A fase lunar adiciona um charme especial. Uso como meu relógio principal para eventos.',
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80'],
    verified: true,
    helpful: 34,
    createdAt: '2024-11-01',
  },
  {
    id: 'rev_016',
    productId: 'prod_006',
    customerName: 'Pedro H.',
    customerAvatar: AVATAR_2,
    rating: 5,
    title: 'Romântico e sofisticado',
    comment: 'Dei de presente para minha esposa e ela não para de elogiar. A complicação de fase lunar é um diferencial único.',
    verified: true,
    helpful: 21,
    createdAt: '2024-09-18',
  },

  // Reviews for prod_007 - Belvoir Skeleton Artisan
  {
    id: 'rev_017',
    productId: 'prod_007',
    customerName: 'Daniel F.',
    customerAvatar: AVATAR_4,
    rating: 5,
    title: 'Mecânica visível é fascinante',
    comment: 'Sempre quis um skeleton e o Artisan superou minhas expectativas. A decoração à mão é visível em cada detalhe. O titânio deixa o relógio super leve.',
    verified: true,
    helpful: 27,
    createdAt: '2024-10-25',
  },
  {
    id: 'rev_018',
    productId: 'prod_007',
    customerName: 'Bruno T.',
    customerAvatar: AVATAR_6,
    rating: 4,
    title: 'Impressionante',
    comment: 'O movimento é lindo de ver, mas precisa de cuidado por ser esqueletizado. Recomendo para quem vai usar com cuidado.',
    verified: true,
    helpful: 14,
    createdAt: '2024-09-10',
  },

  // Reviews for prod_008 - Belvoir Perpetual Calendar
  {
    id: 'rev_019',
    productId: 'prod_008',
    customerName: 'Gustavo R.',
    customerAvatar: AVATAR_1,
    rating: 5,
    title: 'O topo da relojoaria',
    comment: 'Calendário perpétuo é o santo graal das complicações e a Belvoir entregou uma peça magistral. A complexidade mecânica é impressionante.',
    verified: true,
    helpful: 45,
    createdAt: '2024-11-10',
  },
  {
    id: 'rev_020',
    productId: 'prod_008',
    customerName: 'Alexandre N.',
    rating: 5,
    title: 'Herança para gerações',
    comment: 'Comprei pensando em deixar para meu filho. Uma peça assim atravessa gerações. Qualidade suíça impecável.',
    verified: true,
    helpful: 38,
    createdAt: '2024-08-28',
  },
];

// Calculate review summaries dynamically
export const calculateReviewSummary = (productId: string): ReviewSummary => {
  const productReviews = reviews.filter(r => r.productId === productId);

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
    .filter(r => r.productId === productId)
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
