import { useEffect, useRef } from "react";
import type { Bar } from "@/lib/bars-data";

export type MapPopup = {
  ratingLabel: string;
  reserveLabel: string;
  categoryLabel: (bar: Bar) => string;
  priceLabel: (bar: Bar) => string;
  onReserve: (bar: Bar) => void;
};

type Props = {
  bars: Bar[];
  center: { lat: number; lng: number };
  zoom?: number;
  onPinClick?: (bar: Bar) => void;
  popup?: MapPopup;
};

export function MapView({ bars, center, zoom = 13, onPinClick, popup }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onClickRef = useRef(onPinClick);
  const popupRef = useRef(popup);
  onClickRef.current = onPinClick;
  popupRef.current = popup;

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
      const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true })
        .setView([center.lat, center.lng], zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      mapRef.current = map;
      addMarkers(L, map);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-center & re-pin when country/city/bars change → animated flyTo
  useEffect(() => {
    (async () => {
      if (!mapRef.current) return;
      const L = (await import("leaflet")).default;
      mapRef.current.flyTo([center.lat, center.lng], zoom, { duration: 1.0 });
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

      if (popupRef.current) {
        const p = popupRef.current;
        const html = `
          <div class="lm-popup">
            <img src="${bar.image}" alt="" class="lm-popup-img"/>
            <div class="lm-popup-body">
              <div class="lm-popup-title">${escapeHtml(bar.name)}</div>
              <div class="lm-popup-meta">
                <span class="lm-popup-cat">${escapeHtml(p.categoryLabel(bar))}</span>
                <span class="lm-popup-rating">★ ${bar.rating} · ${p.ratingLabel}</span>
              </div>
              <div class="lm-popup-price">${escapeHtml(p.priceLabel(bar))}</div>
              <button class="lm-popup-btn" data-action="reserve">${escapeHtml(p.reserveLabel)}</button>
            </div>
          </div>`;
        marker.bindPopup(html, { maxWidth: 240, className: "lm-popup-wrapper", closeButton: true });
        marker.on("popupopen", (e: any) => {
          const node: HTMLElement = e.popup.getElement();
          const btn = node?.querySelector('[data-action="reserve"]') as HTMLButtonElement | null;
          if (btn) btn.onclick = () => {
            popupRef.current?.onReserve(bar);
            map.closePopup();
          };
        });
      }
      marker.on("click", () => onClickRef.current?.(bar));
      markersRef.current.push(marker);
    });
  }

  return <div ref={containerRef} className="absolute inset-0" />;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}
