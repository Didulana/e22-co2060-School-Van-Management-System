import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stop } from "../../services/parentService";

interface TrackingMapProps {
  latitude: number;
  longitude: number;
  lastUpdated?: string;
  routeStops?: Stop[];
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
  routeStops = []
}: TrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);

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

    if (leafletMap.current && routeStops.length > 0 && !routeLine.current) {
        const coordsString = routeStops
            .sort((a, b) => a.order - b.order)
            .map(s => `${s.longitude},${s.latitude}`)
            .join(";");

        fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
            .then(res => res.json())
            .then(data => {
                if (data.routes && data.routes[0] && leafletMap.current) {
                    const geojson = data.routes[0].geometry;
                    const coords = geojson.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
                    
                    if (routeLine.current) leafletMap.current.removeLayer(routeLine.current);
                    
                    routeLine.current = L.polyline(coords, {
                        color: "#10b981",
                        weight: 4,
                        opacity: 0.5,
                        dashArray: '10, 10'
                    }).addTo(leafletMap.current);
                }
            })
            .catch(err => console.error("Tracking Map Route Error:", err));
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
  }, [latitude, longitude, lastUpdated, routeStops]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }}></div>
    </div>
  );
}