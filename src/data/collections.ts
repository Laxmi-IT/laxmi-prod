export type Category = 'all' | 'cucina' | 'living' | 'dispensa' | 'dettagli';

export interface CollectionImage {
  id: string;
  src: string;
  category: Category;
  series: string;
  title: {
    en: string;
    it: string;
  };
  description: {
    en: string;
    it: string;
  };
}

const BASE_PATH = '/images/ARREXLAB_PHOTOS/FOTO_PER_INTERNET';

export const collectionImages: CollectionImage[] = [
  // LOFT 2.2 Series - Modern Minimalist Kitchen
  {
    id: 'loft22-supermatt-wood',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2 - SUPERMATT-WOOD.jpg`,
    category: 'cucina',
    series: 'LOFT 2.2',
    title: {
      en: 'Supermatt Wood',
      it: 'Supermatt Legno'
    },
    description: {
      en: 'Contemporary elegance meets natural warmth in this seamless fusion of supermatt finish and premium wood elements.',
      it: 'L\'eleganza contemporanea incontra il calore naturale in questa fusione perfetta tra finitura supermatt e pregiate essenze legnose.'
    }
  },
  {
    id: 'loft22-pet-daytona-rigato',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2-PET-DAYTONA-RIGATO.jpg`,
    category: 'cucina',
    series: 'LOFT 2.2',
    title: {
      en: 'Pet Daytona Ribbed',
      it: 'Pet Daytona Rigato'
    },
    description: {
      en: 'Textured sophistication with ribbed PET finish, creating subtle play of light and shadow.',
      it: 'Sofisticatezza tessile con finitura PET rigata, creando un sottile gioco di luci e ombre.'
    }
  },
  {
    id: 'loft22-pet-style',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2-PET-STYLE.jpg`,
    category: 'living',
    series: 'LOFT 2.2',
    title: {
      en: 'Pet Style',
      it: 'Pet Style'
    },
    description: {
      en: 'Open-plan living redefined with sleek PET surfaces and minimalist Italian design.',
      it: 'Open space ridefinito con superfici PET eleganti e design minimalista italiano.'
    }
  },
  {
    id: 'loft22-pet-style1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2-PET-STYLE1.jpg`,
    category: 'living',
    series: 'LOFT 2.2',
    title: {
      en: 'Pet Style Living',
      it: 'Pet Style Living'
    },
    description: {
      en: 'Where culinary artistry meets contemporary living in perfect harmony.',
      it: 'Dove l\'arte culinaria incontra il living contemporaneo in perfetta armonia.'
    }
  },
  {
    id: 'loft22-style-line',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2-STYLE-LINE.jpg`,
    category: 'cucina',
    series: 'LOFT 2.2',
    title: {
      en: 'Style Line',
      it: 'Style Line'
    },
    description: {
      en: 'Clean horizontal lines define this masterpiece of modern kitchen architecture.',
      it: 'Linee orizzontali pulite definiscono questo capolavoro di architettura cucina moderna.'
    }
  },
  {
    id: 'loft22-supermatt-ombra-nuvola',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2-SUPERMATT Ombra-Nuvola.jpg`,
    category: 'cucina',
    series: 'LOFT 2.2',
    title: {
      en: 'Supermatt Shadow Cloud',
      it: 'Supermatt Ombra Nuvola'
    },
    description: {
      en: 'Ethereal tones of shadow and cloud create a serene culinary sanctuary.',
      it: 'Toni eterei di ombra e nuvola creano un sereno santuario culinario.'
    }
  },
  {
    id: 'loft22-wood-rovere-tokyo',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/LOFT2.2-WOOD-Rovere Tokyo.jpg`,
    category: 'cucina',
    series: 'LOFT 2.2',
    title: {
      en: 'Tokyo Oak Wood',
      it: 'Legno Rovere Tokyo'
    },
    description: {
      en: 'Japanese-inspired oak finish brings zen tranquility to Italian craftsmanship.',
      it: 'Finitura rovere ispirata al Giappone porta tranquillità zen all\'artigianato italiano.'
    }
  },
  {
    id: 'loft22-pet-daytona-liscio-rigato',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/loft2.2-pet-daytona- liscio-rigato.jpg`,
    category: 'cucina',
    series: 'LOFT 2.2',
    title: {
      en: 'Pet Daytona Smooth Ribbed',
      it: 'Pet Daytona Liscio Rigato'
    },
    description: {
      en: 'Dual texture mastery combining smooth and ribbed surfaces in perfect balance.',
      it: 'Maestria della doppia texture che combina superfici lisce e rigate in perfetto equilibrio.'
    }
  },
  // Loft 2.2 Detail Shots (numbered series)
  {
    id: 'loft22-01',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-01.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail I', it: 'Loft 2.2 Dettaglio I' },
    description: { en: 'Precision engineering meets artisanal excellence.', it: 'Ingegneria di precisione incontra eccellenza artigianale.' }
  },
  {
    id: 'loft22-02',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-02.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail II', it: 'Loft 2.2 Dettaglio II' },
    description: { en: 'Seamless integration of form and function.', it: 'Integrazione perfetta di forma e funzione.' }
  },
  {
    id: 'loft22-03',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-03.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail III', it: 'Loft 2.2 Dettaglio III' },
    description: { en: 'Every joint tells a story of mastery.', it: 'Ogni giuntura racconta una storia di maestria.' }
  },
  {
    id: 'loft22-04',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-04.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail IV', it: 'Loft 2.2 Dettaglio IV' },
    description: { en: 'Crafted with intention, finished with perfection.', it: 'Creato con intenzione, rifinito con perfezione.' }
  },
  {
    id: 'loft22-05',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-05.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail V', it: 'Loft 2.2 Dettaglio V' },
    description: { en: 'Where precision meets passion.', it: 'Dove la precisione incontra la passione.' }
  },
  {
    id: 'loft22-06',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-06.jpg`,
    category: 'dispensa',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Storage', it: 'Loft 2.2 Dispensa' },
    description: { en: 'Intelligent storage solutions for the modern home.', it: 'Soluzioni di stoccaggio intelligenti per la casa moderna.' }
  },
  {
    id: 'loft22-07',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-07.jpg`,
    category: 'dispensa',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Pantry', it: 'Loft 2.2 Dispensa' },
    description: { en: 'Organization elevated to an art form.', it: 'Organizzazione elevata a forma d\'arte.' }
  },
  {
    id: 'loft22-08',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-08.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail VIII', it: 'Loft 2.2 Dettaglio VIII' },
    description: { en: 'Attention to every millimeter.', it: 'Attenzione ad ogni millimetro.' }
  },
  {
    id: 'loft22-09',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-09.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail IX', it: 'Loft 2.2 Dettaglio IX' },
    description: { en: 'The beauty of Italian engineering.', it: 'La bellezza dell\'ingegneria italiana.' }
  },
  {
    id: 'loft22-10',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-10.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail X', it: 'Loft 2.2 Dettaglio X' },
    description: { en: 'Timeless design in every detail.', it: 'Design senza tempo in ogni dettaglio.' }
  },
  {
    id: 'loft22-11',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-11.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail XI', it: 'Loft 2.2 Dettaglio XI' },
    description: { en: 'Excellence in every corner.', it: 'Eccellenza in ogni angolo.' }
  },
  {
    id: 'loft22-12',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-12.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail XII', it: 'Loft 2.2 Dettaglio XII' },
    description: { en: 'Italian craftsmanship perfected.', it: 'Artigianato italiano perfezionato.' }
  },
  {
    id: 'loft22-13',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Loft-2.2-13.jpg`,
    category: 'dettagli',
    series: 'LOFT 2.2',
    title: { en: 'Loft 2.2 Detail XIII', it: 'Loft 2.2 Dettaglio XIII' },
    description: { en: 'Where quality speaks for itself.', it: 'Dove la qualità parla da sé.' }
  },

  // Gea Loft22 Series - Contemporary Open-Plan
  {
    id: 'gea-loft22-01-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_01 (1).jpg`,
    category: 'living',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Living Space', it: 'Gea Spazio Living' },
    description: { en: 'Fluid boundaries between kitchen and living create harmonious flow.', it: 'Confini fluidi tra cucina e living creano un flusso armonioso.' }
  },
  {
    id: 'gea-loft22-01-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_01 (2).jpg`,
    category: 'living',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Living Perspective', it: 'Gea Prospettiva Living' },
    description: { en: 'Open concept living at its finest Italian expression.', it: 'Open concept nella sua più raffinata espressione italiana.' }
  },
  {
    id: 'gea-loft22-03-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_03. (1).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Kitchen Island', it: 'Gea Isola Cucina' },
    description: { en: 'The island as sculptural centerpiece and social hub.', it: 'L\'isola come fulcro scultoreo e centro sociale.' }
  },
  {
    id: 'gea-loft22-03-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_03. (2).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Kitchen Detail', it: 'Gea Dettaglio Cucina' },
    description: { en: 'Precision meets poetry in every element.', it: 'Precisione e poesia in ogni elemento.' }
  },
  {
    id: 'gea-loft22-04-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_04. (1).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Composition', it: 'Gea Composizione' },
    description: { en: 'Architectural composition that defines modern luxury.', it: 'Composizione architettonica che definisce il lusso moderno.' }
  },
  {
    id: 'gea-loft22-04-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_04. (2).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Kitchen View', it: 'Gea Vista Cucina' },
    description: { en: 'Where functionality embraces aesthetic excellence.', it: 'Dove la funzionalità abbraccia l\'eccellenza estetica.' }
  },
  {
    id: 'gea-loft22-05-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_05. (1).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Natural Light', it: 'Gea Luce Naturale' },
    description: { en: 'Natural light dancing across premium surfaces.', it: 'La luce naturale danza su superfici pregiate.' }
  },
  {
    id: 'gea-loft22-05-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_05. (2).jpg`,
    category: 'living',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Integration', it: 'Gea Integrazione' },
    description: { en: 'Seamless integration of culinary and living spaces.', it: 'Integrazione perfetta tra spazi culinari e living.' }
  },
  {
    id: 'gea-loft22-06-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_06. (1).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Work Surface', it: 'Gea Piano di Lavoro' },
    description: { en: 'Work surfaces designed for culinary excellence.', it: 'Piani di lavoro progettati per l\'eccellenza culinaria.' }
  },
  {
    id: 'gea-loft22-06-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_06. (2).jpg`,
    category: 'dettagli',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Material Detail', it: 'Gea Dettaglio Materiale' },
    description: { en: 'Premium materials selected for lasting beauty.', it: 'Materiali pregiati selezionati per una bellezza duratura.' }
  },
  {
    id: 'gea-loft22-07-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_07. (1).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Storage Design', it: 'Gea Design Storage' },
    description: { en: 'Intelligent storage hidden behind elegant facades.', it: 'Storage intelligente nascosto dietro facciate eleganti.' }
  },
  {
    id: 'gea-loft22-07-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_07. (2).jpg`,
    category: 'dispensa',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Pantry System', it: 'Gea Sistema Dispensa' },
    description: { en: 'Organization meets sophistication.', it: 'Organizzazione incontra sofisticatezza.' }
  },
  {
    id: 'gea-loft22-08-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_08. (1).jpg`,
    category: 'cucina',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Final Composition', it: 'Gea Composizione Finale' },
    description: { en: 'The complete vision realized in premium materials.', it: 'La visione completa realizzata in materiali pregiati.' }
  },
  {
    id: 'gea-loft22-08-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_08. (2).jpg`,
    category: 'living',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Ambiance', it: 'Gea Atmosfera' },
    description: { en: 'Creating atmosphere through design excellence.', it: 'Creare atmosfera attraverso l\'eccellenza del design.' }
  },
  {
    id: 'gea-loft22-08-3',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/Gea_Loft22_08. (3).jpg`,
    category: 'dettagli',
    series: 'GEA LOFT 22',
    title: { en: 'Gea Finishing', it: 'Gea Finitura' },
    description: { en: 'Premium finishes that age with grace.', it: 'Finiture pregiate che invecchiano con grazia.' }
  },

  // AL32 Series - Classic Elegance
  {
    id: 'al32-vetro-cannettato-nero-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/AL32 Vetro Cannettato Nero 1.jpg`,
    category: 'cucina',
    series: 'AL32',
    title: { en: 'AL32 Ribbed Black Glass', it: 'AL32 Vetro Cannettato Nero' },
    description: { en: 'Dramatic ribbed glass in noir sophistication.', it: 'Vetro cannettato drammatico in sofisticatezza noir.' }
  },
  {
    id: 'al32-vetro-cannettato-nero',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/AL32 vetro cannettato nero.jpg`,
    category: 'cucina',
    series: 'AL32',
    title: { en: 'AL32 Glass Detail', it: 'AL32 Dettaglio Vetro' },
    description: { en: 'Light refracting through artisanal glass work.', it: 'Luce che si rifrange attraverso vetro artigianale.' }
  },
  {
    id: 'al32-main',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/AL32.jpg`,
    category: 'cucina',
    series: 'AL32',
    title: { en: 'AL32 Collection', it: 'Collezione AL32' },
    description: { en: 'Classic Italian elegance reimagined for modern living.', it: 'Eleganza italiana classica reimmaginata per il vivere moderno.' }
  },

  // EVA Series - Refined Sophistication
  {
    id: 'eva-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/EVA (1).jpg`,
    category: 'cucina',
    series: 'EVA',
    title: { en: 'Eva Kitchen', it: 'Cucina Eva' },
    description: { en: 'Timeless beauty in every curve and line.', it: 'Bellezza senza tempo in ogni curva e linea.' }
  },
  {
    id: 'eva-3',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/EVA (3).jpg`,
    category: 'living',
    series: 'EVA',
    title: { en: 'Eva Living', it: 'Eva Living' },
    description: { en: 'Where kitchen elegance meets living comfort.', it: 'Dove l\'eleganza della cucina incontra il comfort del living.' }
  },

  // Numbered images from ANTA LISCIA
  {
    id: 'ambiente-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/2.jpg`,
    category: 'cucina',
    series: 'AMBIENTE',
    title: { en: 'Ambiente II', it: 'Ambiente II' },
    description: { en: 'Modern kitchen environment designed for life.', it: 'Ambiente cucina moderno progettato per vivere.' }
  },
  {
    id: 'ambiente-22',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/22.jpg`,
    category: 'cucina',
    series: 'AMBIENTE',
    title: { en: 'Ambiente XXII', it: 'Ambiente XXII' },
    description: { en: 'Sophisticated spaces for sophisticated tastes.', it: 'Spazi sofisticati per gusti sofisticati.' }
  },
  {
    id: 'ambiente-35',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/35.jpg`,
    category: 'cucina',
    series: 'AMBIENTE',
    title: { en: 'Ambiente XXXV', it: 'Ambiente XXXV' },
    description: { en: 'Where design meets daily rituals.', it: 'Dove il design incontra i rituali quotidiani.' }
  },
  {
    id: 'ambiente-40',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/40 (2).jpg`,
    category: 'cucina',
    series: 'AMBIENTE',
    title: { en: 'Ambiente XL', it: 'Ambiente XL' },
    description: { en: 'Extra large vision, extra attention to detail.', it: 'Visione extra large, attenzione extra ai dettagli.' }
  },
  {
    id: 'ambiente-48',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/48.jpg`,
    category: 'dispensa',
    series: 'AMBIENTE',
    title: { en: 'Ambiente XLVIII', it: 'Ambiente XLVIII' },
    description: { en: 'Storage solutions that inspire organization.', it: 'Soluzioni di storage che ispirano organizzazione.' }
  },
  {
    id: 'ambiente-52',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/52.jpg`,
    category: 'dettagli',
    series: 'AMBIENTE',
    title: { en: 'Ambiente LII', it: 'Ambiente LII' },
    description: { en: 'Details that define distinction.', it: 'Dettagli che definiscono la distinzione.' }
  },
  {
    id: 'ambiente-59',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_LISCIA/59.jpg`,
    category: 'dettagli',
    series: 'AMBIENTE',
    title: { en: 'Ambiente LIX', it: 'Ambiente LIX' },
    description: { en: 'Precision in every component.', it: 'Precisione in ogni componente.' }
  },

  // ANTA TELAIO - Frame Door Models
  {
    id: 'carola-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/CAROLA.jpg`,
    category: 'cucina',
    series: 'CAROLA',
    title: { en: 'Carola', it: 'Carola' },
    description: { en: 'Classic frame door elegance with contemporary refinement.', it: 'Eleganza classica dell\'anta telaio con raffinatezza contemporanea.' }
  },
  {
    id: 'carola-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/carola.l.jpg`,
    category: 'cucina',
    series: 'CAROLA',
    title: { en: 'Carola L', it: 'Carola L' },
    description: { en: 'Extended composition for generous spaces.', it: 'Composizione estesa per spazi generosi.' }
  },
  {
    id: 'curryl',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/CURRYL.jpg`,
    category: 'cucina',
    series: 'CURRY',
    title: { en: 'Curry L', it: 'Curry L' },
    description: { en: 'Warm tones and traditional craftsmanship unite.', it: 'Toni caldi e artigianato tradizionale si uniscono.' }
  },
  {
    id: 'eva-telaio',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/EVA (2).jpg`,
    category: 'cucina',
    series: 'EVA',
    title: { en: 'Eva Frame', it: 'Eva Telaio' },
    description: { en: 'Eva collection in refined frame door expression.', it: 'Collezione Eva nell\'espressione raffinata dell\'anta telaio.' }
  },
  {
    id: 'magda',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/MAGDA (3).jpg`,
    category: 'cucina',
    series: 'MAGDA',
    title: { en: 'Magda', it: 'Magda' },
    description: { en: 'Heritage meets innovation in frame door design.', it: 'Tradizione incontra innovazione nel design anta telaio.' }
  },
  {
    id: 'nora-1',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/NORA (1).jpg`,
    category: 'cucina',
    series: 'NORA',
    title: { en: 'Nora', it: 'Nora' },
    description: { en: 'Nordic-inspired simplicity with Italian soul.', it: 'Semplicità nordica con anima italiana.' }
  },
  {
    id: 'nora-2',
    src: `${BASE_PATH}/FOTO_MODELLI_ANTA_TELAIO/NORA (2).jpg`,
    category: 'living',
    series: 'NORA',
    title: { en: 'Nora Living', it: 'Nora Living' },
    description: { en: 'Nora collection extending into living spaces.', it: 'Collezione Nora che si estende negli spazi living.' }
  },
];

export const categories: { value: Category; label: { en: string; it: string } }[] = [
  { value: 'all', label: { en: 'All Collections', it: 'Tutte le Collezioni' } },
  { value: 'cucina', label: { en: 'Kitchen', it: 'Cucina' } },
  { value: 'living', label: { en: 'Living', it: 'Living' } },
  { value: 'dispensa', label: { en: 'Pantry', it: 'Dispensa' } },
  { value: 'dettagli', label: { en: 'Details', it: 'Dettagli' } },
];

export function getImagesByCategory(category: Category): CollectionImage[] {
  if (category === 'all') return collectionImages;
  return collectionImages.filter((img) => img.category === category);
}

export function getImagesBySeries(series: string): CollectionImage[] {
  return collectionImages.filter((img) => img.series === series);
}

export function getAllSeries(): string[] {
  return [...new Set(collectionImages.map((img) => img.series))];
}
