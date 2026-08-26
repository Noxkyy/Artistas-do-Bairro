/**
 * ============================================================
 *  BASE DE DADOS (mock) da plataforma Prisma
 *  - Categorias, artistas, depoimentos e etapas de contratação
 * ============================================================
 */

/** Monta a URL otimizada de uma imagem do Pexels a partir do ID. */
const px = (id: number, w = 800, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export type CategoryId =
  | "todos"
  | "fotografia"
  | "video"
  | "design"
  | "ilustracao"
  | "musica"
  | "motion";

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  count: number;
  /** Nome do ícone Lucide usado no card */
  icon: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "fotografia",
    label: "Fotografia",
    short: "Fotos",
    count: 486,
    icon: "Camera",
    blurb: "Casamento, retrato, moda, produto e gastronômica.",
  },
  {
    id: "video",
    label: "Vídeo & Cinema",
    short: "Vídeo",
    count: 312,
    icon: "Clapperboard",
    blurb: "Publicidade, clipes, eventos, drone e colorização.",
  },
  {
    id: "design",
    label: "Design Gráfico",
    short: "Design",
    count: 398,
    icon: "PenTool",
    blurb: "Branding, editorial, UI e identidade visual.",
  },
  {
    id: "ilustracao",
    label: "Ilustração",
    short: "Ilustra",
    count: 207,
    icon: "Palette",
    blurb: "Editorial, character design e arte sob encomenda.",
  },
  {
    id: "musica",
    label: "Música & Áudio",
    short: "Música",
    count: 174,
    icon: "Music",
    blurb: "Produção, trilha original, mixagem e DJ sets.",
  },
  {
    id: "motion",
    label: "Motion & 3D",
    short: "3D",
    count: 129,
    icon: "Boxes",
    blurb: "Animação, VFX, modelagem e archviz.",
  },
];

export interface Artist {
  id: string;
  name: string;
  role: string;
  category: Exclude<CategoryId, "todos">;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  photo: string;
  cover: string;
  verified: boolean;
  online: boolean;
  tags: string[];
  bio: string;
  projects: number;
  responseTime: string;
  gallery: { src: string; caption: string }[];
  skills: { label: string; value: number }[];
  testimonials: { name: string; role: string; text: string; stars: number }[];
}

const G = (id: number) => px(id, 1200, 800);

export const ARTISTS: Artist[] = [
  {
    id: "marina-duarte",
    name: "Marina Duarte",
    role: "Fotógrafa de Casamentos",
    category: "fotografia",
    city: "Florianópolis · SC",
    rating: 4.9,
    reviews: 128,
    price: 2400,
    photo: px(11388577),
    cover: G(7610529),
    verified: true,
    online: true,
    tags: ["Casamento", "Ensaio", "Analógico"],
    bio: "Documentarista de histórias de amor há 11 anos. Trabalho com luz natural e filme 35mm para entregar um álbum que envelhece bem — sem pose forçada, com o cheiro do dia de verdade.",
    projects: 214,
    responseTime: "~2h",
    gallery: [
      { src: G(7610529), caption: "Making of · Serra Gaúcha" },
      { src: G(16313525), caption: "Tratamento fine-art" },
      { src: G(7598007), caption: "Álbum autoral" },
    ],
    skills: [
      { label: "Luz natural", value: 96 },
      { label: "Direção de casais", value: 90 },
      { label: "Tratamento de cor", value: 88 },
    ],
    testimonials: [
      {
        name: "Juliana & Pedro",
        role: "Casamento em Jurerê",
        text: "A Marina sumiu durante a festa e devolveu 600 fotos que parecem cinema. Choramos na entrega do álbum.",
        stars: 5,
      },
      {
        name: "Casa Lume Eventos",
        role: "Produtora de eventos",
        text: "Pontualidade impecável e entrega antes do prazo. Virou nossa fotógrafa padrão.",
        stars: 5,
      },
    ],
  },
  {
    id: "rafael-nunes",
    name: "Rafael Nunes",
    role: "Fotógrafo de Moda",
    category: "fotografia",
    city: "São Paulo · SP",
    rating: 4.8,
    reviews: 96,
    price: 3100,
    photo: px(34114598),
    cover: G(7513419),
    verified: true,
    online: false,
    tags: ["Editorial", "Lookbook", "Studio"],
    bio: "Editorial de moda com pegada gráfica. Já produzi campanhas para 30+ marcas autorais brasileiras, sempre com equipe completa de styling, beleza e direção de arte.",
    projects: 167,
    responseTime: "~5h",
    gallery: [
      { src: G(7513419), caption: "Backstage · SPFW off" },
      { src: G(8903731), caption: "Lookbook minimal" },
      { src: G(18833779), caption: "Campanha verão" },
    ],
    skills: [
      { label: "Direção de set", value: 94 },
      { label: "Iluminação de estúdio", value: 92 },
      { label: "Retoque high-end", value: 85 },
    ],
    testimonials: [
      {
        name: "Ateliê Vero",
        role: "Marca de moda autoral",
        text: "O Rafael entendeu o conceito na primeira conversa. As imagens venderam a coleção sozinhas.",
        stars: 5,
      },
    ],
  },
  {
    id: "camila-rocha",
    name: "Camila Rocha",
    role: "Diretora de Vídeo Publicitário",
    category: "video",
    city: "Rio de Janeiro · RJ",
    rating: 5.0,
    reviews: 74,
    price: 4800,
    photo: px(17616171),
    cover: G(7513419),
    verified: true,
    online: true,
    tags: ["Publicidade", "Roteiro", "Direção"],
    bio: "Do roteiro ao delivery. Dirijo filmes de marca com narrativa documental — três campanhas minhas passaram em festival internacional de curta publicitário.",
    projects: 132,
    responseTime: "~1h",
    gallery: [
      { src: G(7513419), caption: "Setup de palco · clipe" },
      { src: G(9271233), caption: "Kit de produção" },
      { src: G(7598011), caption: "Storyboard aprovado" },
    ],
    skills: [
      { label: "Roteiro", value: 95 },
      { label: "Direção de cena", value: 93 },
      { label: "Montagem", value: 89 },
    ],
    testimonials: [
      {
        name: "Grupo Maré",
        role: "Rede de restaurantes",
        text: "Entregou filme, cortes para social e vertical em uma semana. Profissionalismo raro.",
        stars: 5,
      },
      {
        name: "Bruna Tavares",
        role: "Head de marketing",
        text: "Direção firme, set leve. Todo mundo saiu querendo trabalhar de novo.",
        stars: 5,
      },
    ],
  },
  {
    id: "diego-marques",
    name: "Diego Marques",
    role: "Videomaker & Piloto de Drone",
    category: "video",
    city: "Curitiba · PR",
    rating: 4.7,
    reviews: 152,
    price: 1600,
    photo: px(3062551),
    cover: G(9271233),
    verified: true,
    online: true,
    tags: ["Drone", "Imobiliário", "Eventos"],
    bio: "Homologado ANAC para voo comercial. Cubro arquitetura, imobiliário de alto padrão e eventos corporativos com cinema camera + drone 6K.",
    projects: 298,
    responseTime: "~30min",
    gallery: [
      { src: G(9271233), caption: "Equipamento em campo" },
      { src: G(7598017), caption: "Tour imobiliário" },
      { src: G(8903731), caption: "Pós-produção" },
    ],
    skills: [
      { label: "Operação de drone", value: 97 },
      { label: "Captação 6K", value: 91 },
      { label: "Estabilização", value: 88 },
    ],
    testimonials: [
      {
        name: "Vert Imóveis",
        role: "Imobiliária boutique",
        text: "Os tours aéreos dobraram o agendamento de visitas. Melhor investimento do ano.",
        stars: 5,
      },
    ],
  },
  {
    id: "beatriz-lopes",
    name: "Beatriz Lopes",
    role: "Designer de Marca",
    category: "design",
    city: "Belo Horizonte · MG",
    rating: 4.9,
    reviews: 203,
    price: 3600,
    photo: px(7147708),
    cover: G(7598007),
    verified: true,
    online: true,
    tags: ["Branding", "Naming", "Sistemas"],
    bio: "Construo identidades que cabem no mundo real: manual, aplicações, templates e treinamento do time. Nada de logo solto em PDF bonito que ninguém usa.",
    projects: 186,
    responseTime: "~3h",
    gallery: [
      { src: G(7598007), caption: "Sistema visual · Café Rota" },
      { src: G(7598011), caption: "Manual de marca" },
      { src: G(7598022), caption: "Aplicações físicas" },
    ],
    skills: [
      { label: "Estratégia de marca", value: 96 },
      { label: "Tipografia", value: 94 },
      { label: "Design systems", value: 87 },
    ],
    testimonials: [
      {
        name: "Café Rota 12",
        role: "Rede de cafeterias",
        text: "A Beatriz entregou mais que um logo: entregou um jeito de a gente se comunicar.",
        stars: 5,
      },
      {
        name: "Studio Nove",
        role: "Arquitetura",
        text: "Processo transparente, entregas no prazo e um cuidado com detalhes absurdo.",
        stars: 5,
      },
    ],
  },
  {
    id: "nara-kimura",
    name: "Nara Kimura",
    role: "Diretora de Arte Digital",
    category: "design",
    city: "São Paulo · SP",
    rating: 4.8,
    reviews: 88,
    price: 4200,
    photo: px(16313504),
    cover: G(7598017),
    verified: true,
    online: false,
    tags: ["UI/UX", "Design System", "Web"],
    bio: "Interface com personalidade. Trabalho em sprints curtos com protótipo clicável na primeira semana — você decide com a mão no produto, não em slide.",
    projects: 94,
    responseTime: "~4h",
    gallery: [
      { src: G(7598017), caption: "Moodboard de produto" },
      { src: G(7598011), caption: "Guia de estilo" },
      { src: G(8903731), caption: "Protótipo em device" },
    ],
    skills: [
      { label: "UI Design", value: 97 },
      { label: "Prototipagem", value: 92 },
      { label: "Acessibilidade", value: 86 },
    ],
    testimonials: [
      {
        name: "FinanBlue",
        role: "Fintech",
        text: "Reduziu o tempo de onboarding em 38%. Design que resolve, não que enfeita.",
        stars: 5,
      },
    ],
  },
  {
    id: "larissa-fontes",
    name: "Larissa Fontes",
    role: "Ilustradora Editorial",
    category: "ilustracao",
    city: "Recife · PE",
    rating: 4.9,
    reviews: 61,
    price: 1200,
    photo: px(7147737),
    cover: G(18833779),
    verified: true,
    online: true,
    tags: ["Editorial", "Capas", "Aquarela digital"],
    bio: "Ilustração para revistas, livros e campanhas. Meu traço mistura xilogravura nordestina com cor digital — reconhecível de longe.",
    projects: 143,
    responseTime: "~6h",
    gallery: [
      { src: G(18833779), caption: "Série editorial" },
      { src: G(7598007), caption: "Capa de revista" },
      { src: G(7598017), caption: "Estudos de cor" },
    ],
    skills: [
      { label: "Ilustração autoral", value: 98 },
      { label: "Cor & textura", value: 93 },
      { label: "Narrativa visual", value: 90 },
    ],
    testimonials: [
      {
        name: "Revista Cerrado",
        role: "Publicação independente",
        text: "Cada capa virou conversa nas redes. Traço inconfundível.",
        stars: 5,
      },
    ],
  },
  {
    id: "igor-beltrao",
    name: "Igor Beltrão",
    role: "Produtor Musical & Sound Designer",
    category: "musica",
    city: "Salvador · BA",
    rating: 4.8,
    reviews: 117,
    price: 2200,
    photo: px(32963795),
    cover: G(9271233),
    verified: true,
    online: true,
    tags: ["Trilha", "Mixagem", "Podcast"],
    bio: "Trilha original e desenho de som para filme, game e podcast. Estúdio próprio com tratamento acústico e entrega em stems para broadcast.",
    projects: 241,
    responseTime: "~2h",
    gallery: [
      { src: G(9271233), caption: "Setup de gravação" },
      { src: G(8903731), caption: "Sessão de mix" },
      { src: G(7513419), caption: "Som ao vivo" },
    ],
    skills: [
      { label: "Composição", value: 95 },
      { label: "Mix & master", value: 92 },
      { label: "Sound design", value: 90 },
    ],
    testimonials: [
      {
        name: "Podcast Maré Alta",
        role: "Produtora de áudio",
        text: "Identidade sonora que virou nossa assinatura. Público reconhece nos 3 primeiros segundos.",
        stars: 5,
      },
    ],
  },
  {
    id: "yasmin-prado",
    name: "Yasmin Prado",
    role: "DJ & Curadoria Sonora",
    category: "musica",
    city: "São Paulo · SP",
    rating: 4.7,
    reviews: 210,
    price: 1800,
    photo: px(38950146),
    cover: G(7513419),
    verified: true,
    online: false,
    tags: ["Eventos", "House", "Curadoria"],
    bio: "Set sob medida para o clima do seu evento — do vernissage silencioso ao fim de festa no teto. Leio a pista e ajusto a seleção em tempo real.",
    projects: 356,
    responseTime: "~1h",
    gallery: [
      { src: G(7513419), caption: "Abertura de exposição" },
      { src: G(9271233), caption: "Rider técnico" },
      { src: G(8903731), caption: "Curadoria pré-evento" },
    ],
    skills: [
      { label: "Leitura de pista", value: 97 },
      { label: "Curadoria", value: 94 },
      { label: "Técnica", value: 88 },
    ],
    testimonials: [
      {
        name: "Galeria Traço",
        role: "Espaço de arte",
        text: "A trilha ao vivo da abertura foi o assunto da noite. Contratamos de novo.",
        stars: 5,
      },
    ],
  },
  {
    id: "paulo-ventura",
    name: "Paulo Ventura",
    role: "Fotógrafo Corporativo",
    category: "fotografia",
    city: "Campinas · SP",
    rating: 4.6,
    reviews: 143,
    price: 950,
    photo: px(30133734),
    cover: G(7610529),
    verified: false,
    online: true,
    tags: ["Retrato executivo", "LinkedIn", "Equipe"],
    bio: "Retratos corporativos com entrega em 48h. Vou até a sua empresa, monto um mini estúdio e fotografo o time inteiro em uma manhã.",
    projects: 402,
    responseTime: "~20min",
    gallery: [
      { src: G(7610529), caption: "Sessão in-company" },
      { src: G(8903731), caption: "Seleção e tratamento" },
      { src: G(7598022), caption: "Padrão de marca" },
    ],
    skills: [
      { label: "Retrato executivo", value: 93 },
      { label: "Iluminação rápida", value: 90 },
      { label: "Entrega em lote", value: 95 },
    ],
    testimonials: [
      {
        name: "RH Norte Tech",
        role: "Recrutamento",
        text: "80 colaboradores fotografados em 4 horas, todos aprovados de primeira.",
        stars: 4,
      },
    ],
  },
  {
    id: "tiago-andrade",
    name: "Tiago Andrade",
    role: "Motion Designer & 3D",
    category: "motion",
    city: "Porto Alegre · RS",
    rating: 4.9,
    reviews: 79,
    price: 2800,
    photo: px(9511748),
    cover: G(18833779),
    verified: true,
    online: true,
    tags: ["VFX", "Archviz", "Blender"],
    bio: "Animação 3D e motion graphics para lançamento de produto. Render em tempo real com Unreal quando o prazo aperta.",
    projects: 118,
    responseTime: "~3h",
    gallery: [
      { src: G(18833779), caption: "Exploração visual" },
      { src: G(7598017), caption: "Frames de campanha" },
      { src: G(8903731), caption: "Pipeline de render" },
    ],
    skills: [
      { label: "Blender", value: 96 },
      { label: "Motion graphics", value: 93 },
      { label: "After Effects", value: 91 },
    ],
    testimonials: [
      {
        name: "Lumen Cosméticos",
        role: "Lançamento de linha",
        text: "O vídeo 3D gerou mais conversão que toda a campanha de foto.",
        stars: 5,
      },
    ],
  },
  {
    id: "caio-ferraz",
    name: "Caio Ferraz",
    role: "Fotógrafo de Retrato & Ensaio",
    category: "fotografia",
    city: "Curitiba · PR",
    rating: 4.8,
    reviews: 187,
    price: 780,
    photo: px(16029823),
    cover: G(16313525),
    verified: true,
    online: true,
    tags: ["Retrato", "Autoral", "Urbano"],
    bio: "Ensaios de retrato sem rigidez. Dirijo quem tem vergonha de câmera até sair natural — em locação urbana ou estúdio.",
    projects: 331,
    responseTime: "~45min",
    gallery: [
      { src: G(16313525), caption: "Ensaio urbano" },
      { src: G(7610529), caption: "Edição autoral" },
      { src: G(7598022), caption: "Série em P&B" },
    ],
    skills: [
      { label: "Direção de pessoas", value: 95 },
      { label: "Retrato em P&B", value: 92 },
      { label: "Locação externa", value: 89 },
    ],
    testimonials: [
      {
        name: "Letícia M.",
        role: "Ensaio pessoal",
        text: "Eu odeio ser fotografada e amei o resultado. O Caio conduz tudo com leveza.",
        stars: 5,
      },
    ],
  },
  {
    id: "otavio-lins",
    name: "Otávio Lins",
    role: "Fotógrafo Gastronômico",
    category: "fotografia",
    city: "Belo Horizonte · MG",
    rating: 4.7,
    reviews: 92,
    price: 1100,
    photo: px(37682383),
    cover: G(7598011),
    verified: false,
    online: false,
    tags: ["Food", "Cardápio", "Delivery"],
    bio: "Fotografia de comida que dá fome. Kits prontos para iFood, cardápio impresso e redes sociais — com food styling incluso.",
    projects: 265,
    responseTime: "~2h",
    gallery: [
      { src: G(7598011), caption: "Cardápio autoral" },
      { src: G(8903731), caption: "Set de food" },
      { src: G(7598007), caption: "Pacote delivery" },
    ],
    skills: [
      { label: "Food styling", value: 94 },
      { label: "Luz contínua", value: 91 },
      { label: "Padronização", value: 90 },
    ],
    testimonials: [
      {
        name: "Bistrô Sal & Brasa",
        role: "Restaurante",
        text: "As vendas do delivery subiram 22% só trocando as fotos do cardápio.",
        stars: 5,
      },
    ],
  },
  {
    id: "ravi-santanna",
    name: "Ravi Sant'Anna",
    role: "Videomaker de Eventos & Clipes",
    category: "video",
    city: "Salvador · BA",
    rating: 4.6,
    reviews: 68,
    price: 1400,
    photo: px(18366238),
    cover: G(7513419),
    verified: true,
    online: true,
    tags: ["Eventos", "Clipes", "Same-day edit"],
    bio: "Cobertura de evento com edição no mesmo dia: saio com o teaser pronto para postar antes do bolo ser cortado.",
    projects: 189,
    responseTime: "~1h",
    gallery: [
      { src: G(7513419), caption: "Same-day edit" },
      { src: G(9271233), caption: "Kit de campo" },
      { src: G(7598017), caption: "Teaser de show" },
    ],
    skills: [
      { label: "Cobertura ao vivo", value: 93 },
      { label: "Edição rápida", value: 95 },
      { label: "Captação de áudio", value: 86 },
    ],
    testimonials: [
      {
        name: "Festival Barra",
        role: "Produção cultural",
        text: "Teaser publicado no mesmo dia. O alcance orgânico explodiu.",
        stars: 5,
      },
    ],
  },
];

/* ------------------------- Depoimentos da plataforma ------------------------ */
export const TESTIMONIALS = [
  {
    name: "Renata Camargo",
    role: "Sócia · Estúdio Caju",
    text: "Fechei um fotógrafo e um motion designer no mesmo dia, os dois a 15 minutos do escritório. O Prisma virou o primeiro lugar onde procuro gente.",
    stars: 5,
    avatar: px(7147707, 400, 400),
  },
  {
    name: "Marcos Tavares",
    role: "Head de Marketing · Norte Tech",
    text: "O contrato com pagamento protegido me tirou o medo de contratar freelance. Já são 11 projetos entregues, nenhum atraso.",
    stars: 5,
    avatar: px(4142863, 400, 400),
  },
  {
    name: "Aline Prado",
    role: "Produtora cultural",
    text: "Filtro por cidade e por faixa de preço e resolvo a produção inteira de um festival em uma tarde. Simples assim.",
    stars: 5,
    avatar: px(7147700, 400, 400),
  },
];

/* ----------------------------- Como funciona ------------------------------- */
export const STEPS = [
  {
    n: "01",
    title: "Busque por talento e região",
    text: "Filtre por especialidade, cidade, faixa de preço e nota. Nada de rolar mil perfis iguais.",
    icon: "Search",
  },
  {
    n: "02",
    title: "Compare portfólios reais",
    text: "Portfólio verificado, avaliações de clientes que contrataram de verdade e tempo médio de resposta.",
    icon: "Layers",
  },
  {
    n: "03",
    title: "Converse sem intermediário",
    text: "Chat direto com o artista, envio de briefing e orçamento alinhado antes de qualquer compromisso.",
    icon: "MessageSquare",
  },
  {
    n: "04",
    title: "Pague com garantia",
    text: "O valor fica retido e só é liberado depois da entrega aprovada. Você e o artista protegidos.",
    icon: "ShieldCheck",
  },
];
