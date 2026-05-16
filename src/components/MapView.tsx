import { useEffect, useRef } from "react";
import type { Bar } from "@/lib/bars-data";

type Props = {
  bars: Bar[];
  center: { lat: number; lng: number };
  zoom?: number;
  onPinClick?: (bar: Bar) => void;
  /** Stable key (e.g., country+city) used to persist pan/zoom across remounts. */
  viewKey?: string;
};

type SavedView = { lat: number; lng: number; zoom: number };
const VIEW_STORAGE_PREFIX = "lm_mapview_";

function readSaved(key: string | undefined): SavedView | null {
  if (!key || typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(VIEW_STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as SavedView) : null;
  } catch { return null; }
}
function writeSaved(key: string | undefined, v: SavedView) {
  if (!key || typeof window === "undefined") return;
  try { sessionStorage.setItem(VIEW_STORAGE_PREFIX + key, JSON.stringify(v)); } catch {}
}

const PIN_HTML = `
<div class="bar-pin-wrap">
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3h14l-1.5 7a5.5 5.5 0 0 1-4 4.3V19h3v2H7.5v-2h3v-4.7a5.5 5.5 0 0 1-4-4.3L5 3z"
      stroke="#0a0a0c" stroke-width="1.5" stroke-linejoin="round"
      fill="url(#g)"/>
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stop-color="#c084fc"/>
        <stop offset="1" stop-color="#67e8f9"/>
      </linearGradient>
    </defs>
  </svg>
</div>`;

export function MapView({ bars, center, zoom = 13, onPinClick, viewKey }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onClickRef = useRef(onPinClick);
  const viewKeyRef = useRef(viewKey);
  onClickRef.current = onPinClick;
  viewKeyRef.current = viewKey;

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "true");
        document.head.appendChild(link);
      }
      if (cancelled || !containerRef.current || mapRef.current) return;

      const saved = readSaved(viewKey);
      const startLat = saved?.lat ?? center.lat;
      const startLng = saved?.lng ?? center.lng;
      const startZoom = saved?.zoom ?? zoom;

      const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true })
        .setView([startLat, startLng], startZoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const persist = () => {
        const c = map.getCenter();
        writeSaved(viewKeyRef.current, { lat: c.lat, lng: c.lng, zoom: map.getZoom() });
      };
      map.on("moveend", persist);
      map.on("zoomend", persist);

      mapRef.current = map;
      addMarkers(L, map);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the active city/country changes (new viewKey), flyTo new center; else just refresh markers.
  const lastKeyRef = useRef<string | undefined>(viewKey);
  useEffect(() => {
    (async () => {
      if (!mapRef.current) return;
      const L = (await import("leaflet")).default;
      const keyChanged = lastKeyRef.current !== viewKey;
      if (keyChanged) {
        const saved = readSaved(viewKey);
        if (saved) {
          mapRef.current.setView([saved.lat, saved.lng], saved.zoom);
        } else {
          mapRef.current.flyTo([center.lat, center.lng], zoom, { duration: 1.0 });
        }
        lastKeyRef.current = viewKey;
      }
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      addMarkers(L, mapRef.current);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom, bars, viewKey]);

  function addMarkers(L: any, map: any) {
    bars.forEach((bar) => {
      const icon = L.divIcon({
        className: "",
        html: PIN_HTML,
        iconSize: [34, 42],
        iconAnchor: [17, 38],
      });
      const marker = L.marker([bar.lat, bar.lng], { icon }).addTo(map);
      marker.on("click", () => onClickRef.current?.(bar));
      markersRef.current.push(marker);
    });
  }

  return <div ref={containerRef} className="absolute inset-0 lm-map" />;
}
