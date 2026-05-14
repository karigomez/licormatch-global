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
  ambience: Category;
  liquor: string;
  available: boolean;
  priceUsd: number;
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

// 12 unique, locally-themed bar names per city (no city suffix) — globally unique.
// Order in each array maps to CATEGORY_CYCLE below: 4 clubs · 4 pubs · 2 rooftop · 2 cocktail.
const NAMES_BY_CITY: Record<CountryCode, Record<string, string[]>> = {
  CO: {
    "Bogotá": [
      "Theatron", "Video Club", "Armando Records", "Baum",
      "Quiebracanto", "El Fabuloso", "La Perseverancia", "Gaira Café",
      "Apache Rooftop", "Octava Sky",
      "Vintrash", "Andrés DC",
    ],
    "Medellín": [
      "Perro Negro", "Salón Amador", "Calle 9+1", "Bendito Seas",
      "La Octava", "El Social", "La Pascasia", "Hijos de Borges",
      "Envy Rooftop", "Panorama Sky",
      "Mama Tequila", "Tinto Tinta",
    ],
    "Cartagena": [
      "Bazurto Social Club", "La Movida", "Donde Fidel", "Mamallena",
      "El Baluarte", "Casa Pestagua", "Demente", "Café del Mar",
      "Buena Vida Rooftop", "Mirador Gastro",
      "Alquímico", "Ávila Lounge",
    ],
  },
  US: {
    "New York": [
      "Marquee", "House of Yes", "Output Loft", "Le Bain",
      "The Standard Biergarten", "Employees Only", "PDT", "The Dead Rabbit",
      "Westlight", "230 Fifth",
      "Attaboy", "Death & Co",
    ],
    "Miami": [
      "LIV Nightclub", "E11even", "Story", "Mr Jones",
      "Sweet Liberty", "Mango's Tropical", "Bodega Taqueria", "Lost Boy",
      "Skylight Rooftop", "Rooftop at 1 Hotel",
      "Broken Shaker", "Better Days",
    ],
    "Los Angeles": [
      "Sound Nightclub", "Avalon Hollywood", "Academy LA", "Exchange LA",
      "Bar Marmont", "Good Times at Davey Wayne's", "No Vacancy", "Apt 503",
      "Highlight Room", "Mama Shelter Roof",
      "The Varnish", "EP & LP",
    ],
  },
  BR: {
    "São Paulo": [
      "D-Edge", "Lab Club", "Caos", "Bar Brahma",
      "Boteco São Bento", "Riviera Bar", "Caracol", "Pirajá",
      "Rooftop FAS", "Skye Bar",
      "Frank Bar", "SubAstor",
    ],
    "Rio de Janeiro": [
      "Pista 3", "Rota 66", "Fosfobox", "Barzin",
      "Belmonte", "Pavão Azul", "Bar Urca", "Galeria Café",
      "Vista Cristo Sky", "Palaphita Kitch",
      "Bar Astor Ipanema", "Aprazível",
    ],
    "Salvador": [
      "Pelô Pelourinho", "Sankofa", "Comércio Alto", "Aldeia Hippie",
      "Boteco do França", "Cantina da Lua", "Pereira Bar", "Mistura Brasil",
      "Solar do Unhão", "Praia Lounge BA",
      "Casa de Tereza", "Spazio Nea Salvador",
    ],
  },
  IT: {
    "Roma": [
      "Akab Club", "Shari Vari", "Goa Club", "Spazio Novecento",
      "Freni e Frizioni", "Il Bar del Fico", "Salotto 42", "Hotel Locarno Bar",
      "Aroma Rooftop", "Terrazza Borromini",
      "Jerry Thomas Speakeasy", "Drink Kong",
    ],
    "Milano": [
      "Just Cavalli", "Plastic", "Tunnel Club", "Old Fashion",
      "Bar Basso", "Camparino in Galleria", "Mag Cafè", "Nottingham Forest",
      "Ceresio 7 Pools", "Terrazza Aperol",
      "1930 Speakeasy", "Iter Cocktail",
    ],
    "Napoli": [
      "Arenile Reload", "Duel Beat", "La Mela Club", "Galleria 19",
      "Birba Bistrot", "Vineria San Pasquale", "Ba-Bar", "Archivio Storico",
      "Terrazza Calabritto", "Sky Bar Romeo",
      "L'Antiquario", "Spazio Nea",
    ],
  },
  FR: {
    "Paris": [
      "Silencio", "Rex Club", "La Machine", "Wanderlust",
      "Le Comptoir Général", "La Belle Époque", "Bar Hemingway", "Combat",
      "Perchoir Marais", "Le 43 Rooftop",
      "Little Red Door", "Candelaria",
    ],
    "Lyon": [
      "Le Sucre Rooftop", "Ninkasi Gerland", "La Boîte à Bulles", "L'Officine",
      "Le Comptoir de la Bourse", "La Cave Saint Vincent", "Soda Bar", "Mojo Bar",
      "Mama Shelter Lyon", "Florian on the Roof",
      "L'Antiquaire", "La Ruche",
    ],
    "Marseille": [
      "Trolleybus", "Le Rooftop R2", "Le Glam", "Carlotta Club",
      "Le Bar de la Marine", "La Caravelle", "Les Berthom", "Bistrot Plage",
      "Toinou Rooftop", "La Friche Belle de Mai",
      "Carry Nation", "Copperbay",
    ],
  },
};

// 4 club · 4 pub · 2 rooftop · 2 cocktail per city → 12 bars/city × 15 cities = 180 bars.
const CATEGORY_CYCLE: Category[] = [
  "club", "club", "club", "club",
  "pub", "pub", "pub", "pub",
  "rooftop", "rooftop",
  "cocktail", "cocktail",
];

const LIQUOR_CYCLE = [
  "cocktails", "cocktails", "cocktails", "cocktails",
  "beer", "beer", "beer", "whisky",
  "cocktails", "wine",
  "cocktails", "mezcal",
];

// 12 dispersed offsets (~1–4 km from city center) so pins spread across neighborhoods.
const OFFSETS: Array<[number, number]> = [
  [ 0.022,  0.018],
  [-0.028,  0.012],
  [ 0.014, -0.026],
  [-0.019, -0.022],
  [ 0.034,  0.004],
  [-0.031, -0.009],
  [ 0.008,  0.031],
  [-0.011,  0.027],
  [ 0.025, -0.014],
  [-0.024,  0.011],
  [ 0.006, -0.018],
  [-0.016,  0.005],
];

// Country-coherent image pools (Unsplash). Each country has 12 distinct photos
// that visually align with the city/country vibe (lighting, scenery, bar style).
const IMAGES_BY_COUNTRY: Record<CountryCode, string[]> = {
  CO: [
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80",
    "https://images.unsplash.com/photo-1597290282695-edc43d0e7129?w=900&q=80",
    "https://images.unsplash.com/photo-1583227122027-d2c7c0f6f50d?w=900&q=80",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=900&q=80",
    "https://images.unsplash.com/photo-1574096145532-aef4f5c5b8dd?w=900&q=80",
    "https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=900&q=80",
    "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=900&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&q=80",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
  ],
  US: [
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80",
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=900&q=80",
    "https://images.unsplash.com/photo-1530035415911-c2e6e7e2b6b6?w=900&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&q=80",
    "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=900&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80",
    "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=900&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&q=80",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=900&q=80",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&q=80",
    "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=900&q=80",
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=900&q=80",
  ],
  BR: [
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&q=80",
    "https://images.unsplash.com/photo-1504675099198-7023dd85f5a3?w=900&q=80",
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=900&q=80",
    "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=900&q=80",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80",
    "https://images.unsplash.com/photo-1583227122027-d2c7c0f6f50d?w=900&q=80",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&q=80",
    "https://images.unsplash.com/photo-1597290282695-edc43d0e7129?w=900&q=80",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
  ],
  IT: [
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=900&q=80",
    "https://images.unsplash.com/photo-1574096145532-aef4f5c5b8dd?w=900&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80",
    "https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=900&q=80",
    "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=900&q=80",
    "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=900&q=80",
    "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=900&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&q=80",
    "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=900&q=80",
  ],
  FR: [
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&q=80",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
    "https://images.unsplash.com/photo-1530035415911-c2e6e7e2b6b6?w=900&q=80",
    "https://images.unsplash.com/photo-1583227122027-d2c7c0f6f50d?w=900&q=80",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=900&q=80",
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=900&q=80",
    "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=900&q=80",
    "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=900&q=80",
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=900&q=80",
    "https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=900&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80",
  ],
};

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
  (Object.keys(CITIES) as CountryCode[]).forEach((country) => {
    const imagePool = IMAGES_BY_COUNTRY[country];
    CITIES[country].forEach((city, cityIdx) => {
      const names = NAMES_BY_CITY[country][city.name];
      for (let i = 0; i < 12; i++) {
        const cat = CATEGORY_CYCLE[i];
        const liq = LIQUOR_CYCLE[i];
        const [dy, dx] = OFFSETS[i];
        bars.push({
          id: `${country}-${city.name}-${i}`.replace(/\s+/g, "_"),
          name: names[i],
          city: city.name,
          country,
          lat: city.lat + dy,
          lng: city.lng + dx,
          rating: Math.round((4.0 + ((i * 7 + city.name.length) % 10) / 10) * 10) / 10,
          ambience: cat,
          liquor: liq,
          available: i % 5 !== 0,
          priceUsd: 12 + ((i * 5) % 45),
          image: imagePool[(cityIdx * 4 + i) % imagePool.length],
          description: DESC_BY_CATEGORY[cat],
        });
      }
    });
  });
  return bars;
}

export const BARS = buildBars();
