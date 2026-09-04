export interface HeroSlide {
  id: string;
  image: string;
  category: string;
  emoji: string;
  shortName: string;
  badgeEs: string;
  badgeEn: string;
  headlinePreEs: string;
  headlinePreEn: string;
  keywordEs: string;
  keywordEn: string;
  subtitleEs: string;
  subtitleEn: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'paris',
    image: '/bg-1-paris.jpg',
    category: 'europa',
    emoji: '🇫🇷',
    shortName: 'París',
    badgeEs: 'París & Europa Soñada',
    badgeEn: 'Paris & Romantic Europe',
    headlinePreEs: 'El viaje soñado a Europa',
    headlinePreEn: 'Your dream journey to Europe',
    keywordEs: 'empieza en París.',
    keywordEn: 'starts in Paris.',
    subtitleEs: 'Descubre la Torre Eiffel, los museos más icónicos y el encanto europeo con expediente blindado para Visa Schengen.',
    subtitleEn: 'Discover the Eiffel Tower, iconic museums, and European elegance with expert Schengen visa guidance.',
  },
  {
    id: 'disney',
    image: '/bg-2-disney.jpg',
    category: 'escapadas-rd',
    emoji: '✨',
    shortName: 'Mundo Mágico',
    badgeEs: 'Mundo Mágico & Aventura',
    badgeEn: 'Magical World & Family Fun',
    headlinePreEs: 'La magia que siempre soñaste',
    headlinePreEn: 'The magic you always dreamed of',
    keywordEs: 'cobra vida aquí.',
    keywordEn: 'comes alive here.',
    subtitleEs: 'Castillos de fantasía, emociones inolvidables para toda la familia y paquetes completos con hoteles oficiales y traslados.',
    subtitleEn: 'Fairytale castles, unforgettable family thrills, and complete travel packages with official hotels and transfers.',
  },
  {
    id: 'cancun',
    image: '/bg-3-cancun.jpg',
    category: 'mexico',
    emoji: '🏖️',
    shortName: 'Cancún',
    badgeEs: 'Cancún & Riviera Maya',
    badgeEn: 'Cancun & Riviera Maya',
    headlinePreEs: 'El descanso absoluto frente al mar',
    headlinePreEn: 'Ultimate oceanfront relaxation',
    keywordEs: 'te espera hoy.',
    keywordEn: 'awaits you today.',
    subtitleEs: 'Playas de arena blanca, barra libre prémium y resorts todo incluido de 5 estrellas con abono inicial accesible.',
    subtitleEn: 'Pristine white-sand beaches, premium open bar, and 5-star all-inclusive resorts with flexible payment plans.',
  },
  {
    id: 'colombia',
    image: '/bg-4-colombia.jpg',
    category: 'colombia',
    emoji: '🇨🇴',
    shortName: 'Colombia',
    badgeEs: 'Colombia Tropical & Colonial',
    badgeEn: 'Tropical & Colonial Colombia',
    headlinePreEs: 'La calidez y el ritmo latino',
    headlinePreEn: 'Warm latin rhythm and charm',
    keywordEs: 'en un solo viaje.',
    keywordEn: 'in one single journey.',
    subtitleEs: 'Calles históricas de Cartagena, la primavera eterna de Medellín y el Peñol de Guatapé sin necesidad de visa.',
    subtitleEn: 'Historic Cartagena streets, Medellin eternal spring, and Guatapé rock with no visa required.',
  },
  {
    id: 'rome',
    image: '/bg-5-rome.jpg',
    category: 'europa',
    emoji: '🏛️',
    shortName: 'Roma',
    badgeEs: 'Roma Eterna & Maravillas',
    badgeEn: 'Eternal Rome & Wonders',
    headlinePreEs: 'Camina por la historia del mundo',
    headlinePreEn: 'Walk through ancient world history',
    keywordEs: 'con total calma.',
    keywordEn: 'with complete calm.',
    subtitleEs: 'El imponente Coliseo, la Fontana di Trevi y la auténtica cocina italiana con seguro médico Schengen de 30.000 € incluido.',
    subtitleEn: 'The Colosseum, Trevi Fountain, and authentic Italian cuisine with mandatory €30,000 Schengen medical insurance.',
  },
  {
    id: 'cruise',
    image: '/bg-6-cruise.jpg',
    category: 'cruceros',
    emoji: '🚢',
    shortName: 'Crucero',
    badgeEs: 'Crucero Caribe Sur Sin Visa',
    badgeEn: 'Visa-Free Caribbean Cruise',
    headlinePreEs: 'Navega hacia islas de ensueño',
    headlinePreEn: 'Sail towards paradise islands',
    keywordEs: 'sin requerir visa.',
    keywordEn: 'with no visa required.',
    subtitleEs: 'Despierta cada mañana en un nuevo puerto: Aruba, Curazao y Bonaire en un crucero de lujo con entretenimiento total.',
    subtitleEn: 'Wake up every morning in a new paradise port: Aruba, Curacao, and Bonaire aboard an all-inclusive luxury cruise.',
  }
];
