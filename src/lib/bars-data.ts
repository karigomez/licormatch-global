import type { CountryCode } from "./i18n";

export type Category = "pub" | "club" | "rooftop" | "cocktail";

export type Bar = {
  id: string;
  name: string;
  city: string;
  country: CountryCode;
  lat: number;
  lng: number;
  rating: number;
  ambience: Category;   // pub | club | rooftop | cocktail
  liquor: string;       // cocktails | whisky | beer | wine | mezcal
  available: boolean;
  priceUsd: number;     // base USD per person
  image: string;
  description: { es: string; en: string; pt: string; it: string; fr: string };
};

export const CITIES: Record<CountryCode, { name: string; lat: number; lng: number }[]> = {
  CO: [
    { name: "Bogotá", lat: 4.711, lng: -74.0721 },
    { name: "Medellín", lat: 6.2442, lng: -75.5812 },
    { name: "Cartagena", lat: 10.391, lng: -75.4794 },
  ],
  US: [
    { name: "New York", lat: 40.7128, lng: -74.006 },
    { name: "Miami", lat: 25.7617, lng: -80.1918 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  ],
  BR: [
    { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
    { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
    { name: "Salvador", lat: -12.9777, lng: -38.5016 },
  ],
  IT: [
    { name: "Roma", lat: 41.9028, lng: 12.4964 },
    { name: "Milano", lat: 45.4642, lng: 9.19 },
    { name: "Napoli", lat: 40.8518, lng: 14.2681 },
  ],
  FR: [
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Lyon", lat: 45.764, lng: 4.8357 },
    { name: "Marseille", lat: 43.2965, lng: 5.3698 },
  ],
};

// 10 distinct names per country → combined with city for global uniqueness.
const NAME_POOLS: Record<CountryCode, string[]> = {
  CO: ["Andrés Carne", "La Sala", "Apache", "Cumbia Club", "El Mozo", "Octava", "Salvo Patria", "Casa Tinto", "Bar Enano", "Theatron"],
  US: ["Velvet Room", "The Aviary", "Skybar", "Black Pearl", "Neon District", "Lost & Found", "Death & Co", "Employees Only", "Attaboy", "The Dead Rabbit"],
  BR: ["Boteco Maré", "Casa Caipira", "Samba Lab", "Praia Lounge", "Cachaça Bar", "Vista Cristo", "Frank Bar", "Guilhotina", "SubAstor", "Tan Tan"],
  IT: ["Aperitivo 1900", "Vino Nero", "Bar della Luna", "La Terrazza", "Speakeasy Roma", "Negroni Club", "Jerry Thomas", "Camparino", "1930", "Drink Kong"],
  FR: ["Le Syndicat", "Bar Hemingway", "La Cave", "Moonshine", "Petite Folie", "Rooftop 8e", "Little Red Door", "Candelaria", "Bisou", "Combat"],
};

// Cycle through 4 categories so every city has a balanced mix.
const CATEGORY_CYCLE: Category[] = [
  "pub", "club", "rooftop", "cocktail",
  "pub", "club", "rooftop", "cocktail",
  "pub", "club",
];

const LIQUOR_CYCLE = [
  "beer", "cocktails", "cocktails", "cocktails",
  "whisky", "wine", "cocktails", "mezcal",
  "beer", "cocktails",
];

// 10 deterministic offsets so pins spread realistically across each city.
const OFFSETS: Array<[number, number]> = [
  [ 0.012,  0.010],
  [-0.014,  0.008],
  [ 0.006, -0.013],
  [-0.009, -0.011],
  [ 0.018,  0.000],
  [-0.017, -0.004],
  [ 0.003,  0.016],
  [-0.005,  0.014],
  [ 0.011, -0.007],
  [-0.013,  0.005],
];

// 30 distinct high-quality bar/club/rooftop/cocktail Unsplash photos.
const IMAGES = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80",
  "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=900&q=80",
  "https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=900&q=80",
  "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=900&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80",
  "https://images.unsplash.com/photo-1597290282695-edc43d0e7129?w=900&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=900&q=80",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
  "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=900&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=900&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
  "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=900&q=80",
  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&q=80",
  "https://images.unsplash.com/photo-1530035415911-c2e6e7e2b6b6?w=900&q=80",
  "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=900&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
  "https://images.unsplash.com/photo-1583227122027-d2c7c0f6f50d?w=900&q=80",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&q=80",
  "https://images.unsplash.com/photo-1504675099198-7023dd85f5a3?w=900&q=80",
  "https://images.unsplash.com/photo-1574096145532-aef4f5c5b8dd?w=900&q=80",
  "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=900&q=80",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
];

const DESC_BY_CATEGORY: Record<Category, Bar["description"]> = {
  pub: {
    es: "Pub auténtico con cervezas artesanales y ambiente local.",
    en: "Authentic pub with craft beers and a local crowd.",
    pt: "Pub autêntico com cervejas artesanais e clima local.",
    it: "Pub autentico con birre artigianali e atmosfera locale.",
    fr: "Pub authentique avec bières artisanales et ambiance locale.",
  },
  club: {
    es: "Discoteca con DJs internacionales y pista hasta el amanecer.",
    en: "Nightclub with international DJs and a dance floor until dawn.",
    pt: "Discoteca com DJs internacionais e pista até o amanhecer.",
    it: "Discoteca con DJ internazionali e pista fino all'alba.",
    fr: "Discothèque avec DJs internationaux et piste jusqu'à l'aube.",
  },
  rooftop: {
    es: "Terraza panorámica con vistas a la ciudad y cócteles de autor.",
    en: "Panoramic rooftop with city views and signature cocktails.",
    pt: "Cobertura panorâmica com vista da cidade e coquetéis autorais.",
    it: "Terrazza panoramica con vista sulla città e cocktail d'autore.",
    fr: "Rooftop panoramique avec vue sur la ville et cocktails signature.",
  },
  cocktail: {
    es: "Bar de cocteles de autor con mixología premiada.",
    en: "Signature cocktail bar with award-winning mixology.",
    pt: "Bar de coquetéis autorais com mixologia premiada.",
    it: "Cocktail bar d'autore con mixology premiata.",
    fr: "Bar à cocktails d'auteur avec mixologie primée.",
  },
};

export function buildBars(): Bar[] {
  const bars: Bar[] = [];
  let imgIdx = 0;
  (Object.keys(CITIES) as CountryCode[]).forEach((country) => {
    CITIES[country].forEach((city) => {
      for (let i = 0; i < 10; i++) {
        const baseName = NAME_POOLS[country][i];
        const cat = CATEGORY_CYCLE[i];
        const liq = LIQUOR_CYCLE[i];
        const [dy, dx] = OFFSETS[i];
        bars.push({
          id: `${country}-${city.name}-${i}`.replace(/\s+/g, "_"),
          name: `${baseName} · ${city.name}`,
          city: city.name,
          country,
          lat: city.lat + dy,
          lng: city.lng + dx,
          rating: Math.round((4.0 + ((i * 7 + city.name.length) % 10) / 10) * 10) / 10,
          ambience: cat,
          liquor: liq,
          available: i % 5 !== 0,
          priceUsd: 12 + ((i * 5) % 45),
          image: IMAGES[imgIdx++ % IMAGES.length],
          description: DESC_BY_CATEGORY[cat],
        });
      }
    });
  });
  return bars;
}

export const BARS = buildBars();
