import type { Product, Collection, ShippingMethod } from '../types';

// Imagens placeholder - serão substituídas por imagens reais
const PLACEHOLDER_WATCH = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
const PLACEHOLDER_WATCH_2 = 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80';
const PLACEHOLDER_WATCH_3 = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80';
const PLACEHOLDER_WATCH_4 = 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80';
const PLACEHOLDER_WATCH_5 = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80';
const PLACEHOLDER_WATCH_6 = 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80';
const PLACEHOLDER_WATCH_7 = 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80';
const PLACEHOLDER_WATCH_8 = 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80';

export const products: Product[] = [
  {
    id: 'prod_001',
    title: 'Belvoir Heritage Chronograph',
    handle: 'belvoir-heritage-chronograph',
    description: `O Belvoir Heritage Chronograph representa a essência da relojoaria de luxo contemporânea. Com um movimento automático suíço de alta precisão, este cronógrafo combina tradição e inovação em uma peça verdadeiramente excepcional.

    A caixa em aço inoxidável 316L é meticulosamente polida à mão, criando um jogo de luzes hipnotizante. O mostrador em azul profundo apresenta índices aplicados em ouro rosa, enquanto os ponteiros esqueletizados revelam a complexidade do movimento interno.

    Cada detalhe foi pensado para proporcionar uma experiência única: a coroa assinada com o brasão Belvoir, as bordas chanfradas que capturam a luz, e a pulseira em couro de crocodilo italiano que abraça o pulso com perfeição.`,
    shortDescription: 'Cronógrafo automático suíço com caixa em aço e mostrador azul profundo.',
    price: 12500,
    compareAtPrice: 15000,
    images: [
      { id: 'img_001_1', src: PLACEHOLDER_WATCH, alt: 'Belvoir Heritage Chronograph - Frente' },
      { id: 'img_001_2', src: PLACEHOLDER_WATCH_2, alt: 'Belvoir Heritage Chronograph - Lateral' },
      { id: 'img_001_3', src: PLACEHOLDER_WATCH_3, alt: 'Belvoir Heritage Chronograph - Detalhe' },
    ],
    variants: [
      { id: 'var_001_1', title: 'Pulseira Couro Marrom', price: 12500, available: true, sku: 'BHC-001-BRN', option1: 'Couro Marrom' },
      { id: 'var_001_2', title: 'Pulseira Couro Preto', price: 12500, available: true, sku: 'BHC-001-BLK', option1: 'Couro Preto' },
      { id: 'var_001_3', title: 'Pulseira Aço', price: 13500, available: true, sku: 'BHC-001-STL', option1: 'Aço Inoxidável' },
    ],
    category: 'Cronógrafos',
    tags: ['cronógrafo', 'automático', 'luxo', 'clássico'],
    available: true,
    totalInventory: 15,
    brand: 'Belvoir',
    material: 'Aço Inoxidável 316L',
    movement: 'Automático Suíço',
    waterResistance: '100m',
    caseDiameter: '42mm',
    features: ['Cronógrafo', 'Data', 'Reserva de Marcha 48h', 'Vidro Safira'],
    createdAt: '2024-01-15',
  },
  {
    id: 'prod_002',
    title: 'Belvoir Classique Dress Watch',
    handle: 'belvoir-classique-dress-watch',
    description: `O Belvoir Classique é a personificação da elegância atemporal. Este relógio dress watch foi desenhado para acompanhar os momentos mais importantes da sua vida, oferecendo sofisticação discreta e refinamento absoluto.

    O mostrador prateado guilloché é criado através de uma técnica centenária de gravação, resultando em um padrão hipnotizante que dança com a luz. Os ponteiros dauphine em ouro 18k complementam a estética clássica, enquanto o movimento manufatura oferece precisão impecável.

    Com apenas 7mm de espessura, o Classique desliza sob qualquer punho de camisa, revelando-se apenas nos momentos certos. A pulseira em couro de bezerro italiano é macia como seda e envelhece graciosamente com o tempo.`,
    shortDescription: 'Dress watch ultra-fino com mostrador guilloché e movimento manufatura.',
    price: 8900,
    images: [
      { id: 'img_002_1', src: PLACEHOLDER_WATCH_4, alt: 'Belvoir Classique - Frente' },
      { id: 'img_002_2', src: PLACEHOLDER_WATCH_5, alt: 'Belvoir Classique - Perfil' },
    ],
    variants: [
      { id: 'var_002_1', title: 'Ouro Rosa / Marrom', price: 8900, available: true, sku: 'BCL-002-RG', option1: 'Ouro Rosa' },
      { id: 'var_002_2', title: 'Ouro Amarelo / Preto', price: 8900, available: true, sku: 'BCL-002-YG', option1: 'Ouro Amarelo' },
      { id: 'var_002_3', title: 'Platina / Azul', price: 12900, available: false, sku: 'BCL-002-PT', option1: 'Platina' },
    ],
    category: 'Clássicos',
    tags: ['dress watch', 'ultra-fino', 'elegante', 'formal'],
    available: true,
    totalInventory: 8,
    brand: 'Belvoir',
    material: 'Ouro 18k',
    movement: 'Automático Manufatura',
    waterResistance: '30m',
    caseDiameter: '38mm',
    features: ['Ultra-fino 7mm', 'Guilloché', 'Fundo Transparente', 'Vidro Safira'],
    createdAt: '2024-02-20',
  },
  {
    id: 'prod_003',
    title: 'Belvoir Diver Professional',
    handle: 'belvoir-diver-professional',
    description: `O Belvoir Diver Professional foi desenvolvido para aqueles que não conhecem limites. Certificado para mergulhos até 300 metros, este instrumento de precisão combina robustez extrema com a elegância característica da maison Belvoir.

    A luneta unidirecional em cerâmica é praticamente indestrutível, mantendo sua aparência impecável mesmo após anos de uso intenso. O mostrador negro apresenta índices luminosos de alta visibilidade, garantindo leitura perfeita mesmo nas profundezas oceânicas.

    A válvula de hélio permite mergulhos de saturação prolongados, enquanto a pulseira em aço com extensão permite uso sobre trajes de mergulho. Para o dia a dia, a pulseira em borracha trópica oferece conforto incomparável.`,
    shortDescription: 'Relógio de mergulho profissional certificado para 300m com luneta cerâmica.',
    price: 9800,
    compareAtPrice: 11000,
    images: [
      { id: 'img_003_1', src: PLACEHOLDER_WATCH_6, alt: 'Belvoir Diver - Frente' },
      { id: 'img_003_2', src: PLACEHOLDER_WATCH_7, alt: 'Belvoir Diver - Submerso' },
      { id: 'img_003_3', src: PLACEHOLDER_WATCH_8, alt: 'Belvoir Diver - Detalhe Luneta' },
    ],
    variants: [
      { id: 'var_003_1', title: 'Preto / Borracha', price: 9800, available: true, sku: 'BDP-003-BLK', option1: 'Preto' },
      { id: 'var_003_2', title: 'Azul / Borracha', price: 9800, available: true, sku: 'BDP-003-BLU', option1: 'Azul' },
      { id: 'var_003_3', title: 'Verde / Aço', price: 10800, available: true, sku: 'BDP-003-GRN', option1: 'Verde' },
    ],
    category: 'Esportivos',
    tags: ['diver', 'mergulho', 'profissional', 'esportivo'],
    available: true,
    totalInventory: 22,
    brand: 'Belvoir',
    material: 'Aço Inoxidável 316L',
    movement: 'Automático Suíço',
    waterResistance: '300m',
    caseDiameter: '44mm',
    features: ['300m WR', 'Luneta Cerâmica', 'Válvula Hélio', 'Super-Luminova'],
    createdAt: '2024-03-10',
  },
  {
    id: 'prod_004',
    title: 'Belvoir Tourbillon Reserve',
    handle: 'belvoir-tourbillon-reserve',
    description: `O Belvoir Tourbillon Reserve é a expressão máxima da alta relojoaria. Esta obra-prima apresenta um tourbillon voador visível às 6 horas, uma complicação que compensa os efeitos da gravidade para oferecer precisão absoluta.

    O movimento, composto por 280 componentes meticulosamente decorados à mão, é visível através do mostrador esqueletizado e do fundo em cristal safira. Cada ponte apresenta acabamento Côtes de Genève, e cada parafuso é polido individualmente.

    Produzido em série limitada de apenas 50 peças por ano, o Tourbillon Reserve é um verdadeiro investimento para colecionadores exigentes. A caixa em ouro rosa 18k abriga esta complicação suprema, protegida por cristal safira abobadado.`,
    shortDescription: 'Tourbillon voador em ouro rosa 18k, edição limitada de 50 peças.',
    price: 89000,
    images: [
      { id: 'img_004_1', src: PLACEHOLDER_WATCH, alt: 'Belvoir Tourbillon - Frente' },
      { id: 'img_004_2', src: PLACEHOLDER_WATCH_3, alt: 'Belvoir Tourbillon - Movimento' },
    ],
    variants: [
      { id: 'var_004_1', title: 'Ouro Rosa', price: 89000, available: true, sku: 'BTR-004-RG', option1: 'Ouro Rosa 18k' },
      { id: 'var_004_2', title: 'Ouro Branco', price: 95000, available: false, sku: 'BTR-004-WG', option1: 'Ouro Branco 18k' },
    ],
    category: 'Alta Relojoaria',
    tags: ['tourbillon', 'alta relojoaria', 'edição limitada', 'investimento'],
    available: true,
    totalInventory: 3,
    brand: 'Belvoir',
    material: 'Ouro Rosa 18k',
    movement: 'Tourbillon Manual',
    waterResistance: '30m',
    caseDiameter: '40mm',
    features: ['Tourbillon Voador', 'Reserva de Marcha 72h', 'Edição Limitada', 'Numerado'],
    createdAt: '2024-01-01',
  },
  {
    id: 'prod_005',
    title: 'Belvoir GMT Traveler',
    handle: 'belvoir-gmt-traveler',
    description: `Para o viajante sofisticado, o Belvoir GMT Traveler oferece a funcionalidade de dois fusos horários em um design elegante e versátil. O ponteiro GMT em vermelho vibrante contrasta com o mostrador preto acetinado, permitindo leitura instantânea do horário em casa enquanto você explora o mundo.

    A luneta bidimensional de 24 horas apresenta acabamento cerâmico em dois tons, representando dia e noite. O sistema de ajuste rápido da hora local permite mudanças de fuso sem parar o relógio, mantendo a precisão do segundo fuso.

    A pulseira em aço com fecho de segurança oferece conforto durante longas viagens, enquanto a resistência à água de 100 metros garante tranquilidade em qualquer aventura.`,
    shortDescription: 'GMT com dois fusos horários e luneta cerâmica bicolor.',
    price: 11200,
    images: [
      { id: 'img_005_1', src: PLACEHOLDER_WATCH_2, alt: 'Belvoir GMT - Frente' },
      { id: 'img_005_2', src: PLACEHOLDER_WATCH_4, alt: 'Belvoir GMT - Lateral' },
    ],
    variants: [
      { id: 'var_005_1', title: 'Preto/Vermelho', price: 11200, available: true, sku: 'BGT-005-BR', option1: 'Preto/Vermelho' },
      { id: 'var_005_2', title: 'Azul/Preto', price: 11200, available: true, sku: 'BGT-005-BP', option1: 'Azul/Preto' },
    ],
    category: 'Viagem',
    tags: ['gmt', 'dois fusos', 'viagem', 'versátil'],
    available: true,
    totalInventory: 18,
    brand: 'Belvoir',
    material: 'Aço Inoxidável 316L',
    movement: 'Automático GMT',
    waterResistance: '100m',
    caseDiameter: '40mm',
    features: ['GMT 2 Fusos', 'Luneta 24h', 'Data', 'Ajuste Rápido'],
    createdAt: '2024-04-05',
  },
  {
    id: 'prod_006',
    title: 'Belvoir Moonphase Elite',
    handle: 'belvoir-moonphase-elite',
    description: `O Belvoir Moonphase Elite captura a poesia do céu noturno em seu pulso. A complicação de fase lunar, representada em um disco azul profundo salpicado de estrelas, é tão precisa que necessita correção apenas uma vez a cada 122 anos.

    O mostrador em mother-of-pearl branco oferece um canvas perfeito para os ponteiros dauphine azulados e os índices romanos dourados. A data é exibida através de uma abertura elegante às 3 horas, completando o conjunto de informações sem comprometer a estética.

    Este é um relógio que transcende a função de marcar horas - é uma peça de joalheria funcional que conecta seu portador aos ciclos eternos da natureza.`,
    shortDescription: 'Relógio com fase lunar precisa e mostrador em madrepérola.',
    price: 14500,
    images: [
      { id: 'img_006_1', src: PLACEHOLDER_WATCH_5, alt: 'Belvoir Moonphase - Frente' },
      { id: 'img_006_2', src: PLACEHOLDER_WATCH_6, alt: 'Belvoir Moonphase - Detalhe' },
    ],
    variants: [
      { id: 'var_006_1', title: 'Aço / Madrepérola', price: 14500, available: true, sku: 'BME-006-ST', option1: 'Aço' },
      { id: 'var_006_2', title: 'Ouro Rosa / Madrepérola', price: 22500, available: true, sku: 'BME-006-RG', option1: 'Ouro Rosa' },
    ],
    category: 'Clássicos',
    tags: ['moonphase', 'fase lunar', 'elegante', 'complicação'],
    available: true,
    totalInventory: 12,
    brand: 'Belvoir',
    material: 'Aço Inoxidável 316L',
    movement: 'Automático',
    waterResistance: '50m',
    caseDiameter: '39mm',
    features: ['Fase Lunar', 'Madrepérola', 'Data', 'Vidro Safira'],
    createdAt: '2024-02-28',
  },
  {
    id: 'prod_007',
    title: 'Belvoir Skeleton Artisan',
    handle: 'belvoir-skeleton-artisan',
    description: `O Belvoir Skeleton Artisan é uma celebração da arte mecânica. Cada componente do movimento foi meticulosamente esqueletizado e decorado à mão, revelando a dança hipnotizante das engrenagens e molas que dão vida ao tempo.

    Os mestres relojoeiros da Belvoir passam mais de 80 horas decorando cada movimento, aplicando técnicas ancestrais como anglagem, perlage e Côtes de Genève. O resultado é uma peça única que desafia a fronteira entre relojoaria e escultura.

    A caixa em titânio grau 5 oferece leveza incomparável, enquanto o tratamento DLC preto cria um contraste dramático com os componentes dourados do movimento. Um relógio para quem aprecia a beleza da complexidade.`,
    shortDescription: 'Movimento esqueletizado à mão em caixa de titânio DLC.',
    price: 18900,
    compareAtPrice: 22000,
    images: [
      { id: 'img_007_1', src: PLACEHOLDER_WATCH_7, alt: 'Belvoir Skeleton - Frente' },
      { id: 'img_007_2', src: PLACEHOLDER_WATCH_8, alt: 'Belvoir Skeleton - Fundo' },
    ],
    variants: [
      { id: 'var_007_1', title: 'Titânio DLC Preto', price: 18900, available: true, sku: 'BSA-007-BLK', option1: 'DLC Preto' },
      { id: 'var_007_2', title: 'Titânio Natural', price: 17900, available: true, sku: 'BSA-007-NAT', option1: 'Natural' },
    ],
    category: 'Alta Relojoaria',
    tags: ['skeleton', 'artesanal', 'titânio', 'exclusivo'],
    available: true,
    totalInventory: 6,
    brand: 'Belvoir',
    material: 'Titânio Grau 5',
    movement: 'Manual Esqueletizado',
    waterResistance: '30m',
    caseDiameter: '41mm',
    features: ['Esqueletizado', '80h Decoração Manual', 'Titânio', 'DLC'],
    createdAt: '2024-03-20',
  },
  {
    id: 'prod_008',
    title: 'Belvoir Perpetual Calendar',
    handle: 'belvoir-perpetual-calendar',
    description: `O Belvoir Perpetual Calendar representa o ápice da complicação relojoeira. Este relógio sabe a diferença entre meses de 30 e 31 dias, reconhece anos bissextos, e não precisará de ajuste manual até o ano 2100.

    Quatro subdials elegantes exibem dia da semana, data, mês e indicador de ano bissexto, todos sincronizados através de um movimento de extraordinária complexidade com mais de 350 componentes. A lua em fase completa adiciona um toque poético a esta maravilha técnica.

    Produzido para conhecedores que apreciam a genialidade mecânica, o Perpetual Calendar é um legado que atravessa gerações, funcionando perfeitamente enquanto for mantido e apreciado.`,
    shortDescription: 'Calendário perpétuo completo com indicador de ano bissexto.',
    price: 68000,
    images: [
      { id: 'img_008_1', src: PLACEHOLDER_WATCH, alt: 'Belvoir Perpetual - Frente' },
      { id: 'img_008_2', src: PLACEHOLDER_WATCH_2, alt: 'Belvoir Perpetual - Detalhe' },
    ],
    variants: [
      { id: 'var_008_1', title: 'Ouro Branco', price: 68000, available: true, sku: 'BPC-008-WG', option1: 'Ouro Branco 18k' },
      { id: 'var_008_2', title: 'Platina', price: 85000, available: false, sku: 'BPC-008-PT', option1: 'Platina 950' },
    ],
    category: 'Alta Relojoaria',
    tags: ['perpetual calendar', 'calendário perpétuo', 'complicação', 'haute horlogerie'],
    available: true,
    totalInventory: 2,
    brand: 'Belvoir',
    material: 'Ouro Branco 18k',
    movement: 'Automático Calendário Perpétuo',
    waterResistance: '30m',
    caseDiameter: '41mm',
    features: ['Calendário Perpétuo', 'Fase Lunar', '350+ Componentes', 'Até 2100'],
    createdAt: '2024-01-10',
  },
];

export const collections: Collection[] = [
  {
    id: 'col_001',
    title: 'Cronógrafos',
    handle: 'cronografos',
    description: 'Precisão e funcionalidade em designs atemporais.',
    image: PLACEHOLDER_WATCH,
    products: products.filter(p => p.category === 'Cronógrafos'),
  },
  {
    id: 'col_002',
    title: 'Clássicos',
    handle: 'classicos',
    description: 'Elegância discreta para os momentos que importam.',
    image: PLACEHOLDER_WATCH_4,
    products: products.filter(p => p.category === 'Clássicos'),
  },
  {
    id: 'col_003',
    title: 'Esportivos',
    handle: 'esportivos',
    description: 'Robustez e estilo para aventuras sem limites.',
    image: PLACEHOLDER_WATCH_6,
    products: products.filter(p => p.category === 'Esportivos'),
  },
  {
    id: 'col_004',
    title: 'Alta Relojoaria',
    handle: 'alta-relojoaria',
    description: 'Obras-primas para colecionadores exigentes.',
    image: PLACEHOLDER_WATCH_7,
    products: products.filter(p => p.category === 'Alta Relojoaria'),
  },
  {
    id: 'col_005',
    title: 'Viagem',
    handle: 'viagem',
    description: 'Companheiros perfeitos para o viajante sofisticado.',
    image: PLACEHOLDER_WATCH_2,
    products: products.filter(p => p.category === 'Viagem'),
  },
];

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'ship_001',
    title: 'Entrega Expressa',
    price: 0,
    estimatedDays: '2-3 dias úteis',
  },
  {
    id: 'ship_002',
    title: 'Entrega Premium (Mesmo dia em SP)',
    price: 150,
    estimatedDays: 'Mesmo dia',
  },
  {
    id: 'ship_003',
    title: 'Retirada na Boutique',
    price: 0,
    estimatedDays: 'Disponível em 24h',
  },
];

export const categories = [
  'Cronógrafos',
  'Clássicos',
  'Esportivos',
  'Alta Relojoaria',
  'Viagem',
];

export const brands = ['Belvoir'];

export const materials = [
  'Aço Inoxidável 316L',
  'Ouro 18k',
  'Ouro Rosa 18k',
  'Ouro Branco 18k',
  'Titânio Grau 5',
  'Platina 950',
];

// Helper functions
export const getProductByHandle = (handle: string): Product | undefined => {
  return products.find(p => p.handle === handle);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getCollectionByHandle = (handle: string): Collection | undefined => {
  return collections.find(c => c.handle === handle);
};

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return products.slice(0, limit);
};

export const getNewArrivals = (limit: number = 4): Product[] => {
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};
