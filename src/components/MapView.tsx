import { useEffect, useRef } from "react";
import type { Bar } from "@/lib/bars-data";

type Props = {
  bars: Bar[];
  center: { lat: number; lng: number };
  zoom?: number;
  onPinClick?: (bar: Bar) => void;
};

export function MapView({ bars, center, zoom = 13, onPinClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onClickRef = useRef(onPinClick);
  onClickRef.current = onPinClick;

  // init map
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      // CSS
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "true");
        document.head.appendChild(link);
      }
      if (cancelled || !containerRef.current) return;
      if (mapRef.current) return;
      const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true })
        .setView([center.lat, center.lng], zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      mapRef.current = map;
      // initial markers
      addMarkers(L, map);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-center & re-pin when inputs change
  useEffect(() => {
    (async () => {
      if (!mapRef.current) return;
      const L = (await import("leaflet")).default;
      mapRef.current.flyTo([center.lat, center.lng], zoom, { duration: 0.8 });
      // clear and re-add
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      addMarkers(L, mapRef.current);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom, bars]);

  function addMarkers(L: any, map: any) {
    bars.forEach((bar, i) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="bar-pin">${i + 1}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker([bar.lat, bar.lng], { icon }).addTo(map);
      marker.on("click", () => onClickRef.current?.(bar));
      markersRef.current.push(marker);
    });
  }

  return <div ref={containerRef} className="absolute inset-0" />;
}
