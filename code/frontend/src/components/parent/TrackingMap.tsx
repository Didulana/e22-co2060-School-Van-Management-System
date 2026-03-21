import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackingMapProps {
  latitude: number;
  longitude: number;
  lastUpdated?: string;
}

const vanIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function TrackingMap({
  latitude,
  longitude,
  lastUpdated,
}: TrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([latitude, longitude], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);

      marker.current = L.marker([latitude, longitude], { icon: vanIcon }).addTo(
        leafletMap.current
      );
    } else {
      leafletMap.current.setView([latitude, longitude], 15);
      marker.current?.setLatLng([latitude, longitude]);
    }

    if (marker.current) {
      const timeStr = lastUpdated ? new Date(lastUpdated).toLocaleString() : "Now";
      marker.current.bindPopup(
        `<div class="text-sm">
           <div class="font-semibold">School Van Location</div>
           <div>Updated: ${timeStr}</div>
         </div>`
      );
    }
  }, [latitude, longitude, lastUpdated]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }}></div>
    </div>
  );
}