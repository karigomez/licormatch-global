import type { CountryCode } from "./i18n";

export type Bar = {
  id: string;
  name: string;
  city: string;
  country: CountryCode;
  lat: number;
  lng: number;
  rating: number;
  ambience: string; // key: chill | dance | rooftop | speakeasy | live
  liquor: string; // key: cocktails | whisky | beer | wine | mezcal
  available: boolean;
  priceUsd: number; // base USD per person
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

const NAME_POOLS: Record<CountryCode, string[]> = {
  CO: ["Andrés Carne", "La Sala", "Apache", "Cumbia Club", "El Mozo", "Octava"],
  US: ["Velvet Room", "The Aviary", "Skybar", "Black Pearl", "Neon District", "Lost & Found"],
  BR: ["Boteco Maré", "Casa Caipira", "Samba Lab", "Praia Lounge", "Cachaça Bar", "Vista Cristo"],
  IT: ["Aperitivo 1900", "Vino Nero", "Bar della Luna", "La Terrazza", "Speakeasy Roma", "Negroni Club"],
  FR: ["Le Syndicat", "Bar Hemingway", "La Cave", "Moonshine", "Petite Folie", "Rooftop 8e"],
};

const AMBIENCES = ["rooftop", "speakeasy", "dance", "chill", "live", "rooftop"];
const LIQUORS = ["cocktails", "whisky", "wine", "mezcal", "beer", "cocktails"];

const IMAGES = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
  "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&q=80",
  "https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=800&q=80",
  "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=800&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
  "https://images.unsplash.com/photo-1597290282695-edc43d0e7129?w=800&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
];

const DESC_BY_AMBIENCE: Record<string, Bar["description"]> = {
  rooftop: {
    es: "Terraza con vistas panorámicas y cócteles de autor.",
    en: "Rooftop with panoramic views and signature cocktails.",
    pt: "Cobertura com vistas panorâmicas e coquetéis autorais.",
    it: "Terrazza con vista panoramica e cocktail d'autore.",
    fr: "Rooftop avec vue panoramique et cocktails signature.",
  },
  speakeasy: {
    es: "Bar oculto, atmósfera íntima y mixología clásica.",
    en: "Hidden bar with intimate vibe and classic mixology.",
    pt: "Bar escondido, atmosfera intimista e mixologia clássica.",
    it: "Bar nascosto, atmosfera intima e mixology classica.",
    fr: "Bar caché, ambiance intime et mixologie classique.",
  },
  dance: {
    es: "Pista vibrante, DJs en vivo hasta el amanecer.",
    en: "Vibrant dance floor, live DJs until dawn.",
    pt: "Pista vibrante, DJs ao vivo até o amanhecer.",
    it: "Pista vibrante, DJ dal vivo fino all'alba.",
    fr: "Piste vibrante, DJs jusqu'à l'aube.",
  },
  chill: {
    es: "Ambiente relajado, ideal para conversar con amigos.",
    en: "Laid-back vibe, perfect for hanging with friends.",
    pt: "Ambiente tranquilo, ideal para conversar com amigos.",
    it: "Atmosfera rilassata, ideale per chiacchierare con gli amici.",
    fr: "Ambiance détendue, idéale pour discuter entre amis.",
  },
  live: {
    es: "Música en vivo todas las noches, jazz y soul.",
    en: "Live music every night, jazz and soul.",
    pt: "Música ao vivo todas as noites, jazz e soul.",
    it: "Musica dal vivo tutte le sere, jazz e soul.",
    fr: "Musique live tous les soirs, jazz et soul.",
  },
};

export function buildBars(): Bar[] {
  const bars: Bar[] = [];
  (Object.keys(CITIES) as CountryCode[]).forEach((country) => {
    CITIES[country].forEach((city) => {
      for (let i = 0; i < 6; i++) {
        const name = NAME_POOLS[country][i];
        const amb = AMBIENCES[i];
        const liq = LIQUORS[i];
        // small offset for pin spread
        const dx = (Math.sin(i * 1.7) * 0.012);
        const dy = (Math.cos(i * 2.3) * 0.012);
        bars.push({
          id: `${country}-${city.name}-${i}`.replace(/\s+/g, "_"),
          name,
          city: city.name,
          country,
          lat: city.lat + dy,
          lng: city.lng + dx,
          rating: Math.round((4.2 + ((i * 7) % 8) / 10) * 10) / 10,
          ambience: amb,
          liquor: liq,
          available: i % 4 !== 0,
          priceUsd: 12 + i * 4,
          image: IMAGES[(i + city.name.length) % IMAGES.length],
          description: DESC_BY_AMBIENCE[amb],
        });
      }
    });
  });
  return bars;
}

export const BARS = buildBars();
