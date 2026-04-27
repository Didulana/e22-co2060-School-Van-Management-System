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

const vanSvg = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="20" fill="#10b981" fill-opacity="0.2"/>
    <rect x="5" y="5" width="30" height="30" rx="15" fill="#10b981"/>
    <path d="M12 18H28M12 22H28M15 26H25M12 14H28" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <circle cx="20" cy="20" r="18" stroke="#10b981" stroke-width="2" stroke-dasharray="2 4" class="animate-pulse"/>
  </svg>
`;

const vanIcon = L.divIcon({
  html: vanSvg,
  className: "custom-van-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const stopIcon = L.divIcon({
  html: `<div class="w-3 h-3 bg-white border-2 border-slate-400 rounded-full shadow-sm"></div>`,
  className: "custom-stop-icon",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
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
  const stopMarkers = useRef<L.Marker[]>([]);
  const routeLine = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([latitude, longitude], 15);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; CartoDB',
      }).addTo(leafletMap.current);

      L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);

      marker.current = L.marker([latitude, longitude], { icon: vanIcon }).addTo(
        leafletMap.current
      );
    } else {
      leafletMap.current.panTo([latitude, longitude], { animate: true });
      marker.current?.setLatLng([latitude, longitude]);
    }

    // Handle stops and route
    if (leafletMap.current && routeStops.length > 0) {
        // Clear old stop markers
        stopMarkers.current.forEach(m => leafletMap.current?.removeLayer(m));
        stopMarkers.current = [];

        routeStops.forEach(stop => {
            const sm = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
                .bindTooltip(stop.name, { permanent: false, direction: 'top' })
                .addTo(leafletMap.current!);
            stopMarkers.current.push(sm);
        });

        if (!routeLine.current) {
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
                            weight: 6,
                            opacity: 0.6,
                            lineJoin: 'round',
                            dashArray: '1, 12'
                        }).addTo(leafletMap.current);
                    }
                })
                .catch(err => console.error("Tracking Map Route Error:", err));
        }
    }

    if (marker.current) {
      const timeStr = lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Live Now";
      marker.current.bindPopup(
        `<div class="p-2 font-sans">
           <div class="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Live Now</div>
           <div class="text-sm font-black text-slate-800">Van is moving</div>
           <div class="text-[10px] font-bold text-slate-400 mt-1">Updated: ${timeStr}</div>
         </div>`,
        { className: 'premium-popup' }
      );
    }
  }, [latitude, longitude, lastUpdated, routeStops]);

  return (
    <div className="h-full w-full overflow-hidden bg-slate-50">
      <div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }}></div>
      <style>{`
        .leaflet-popup-content-wrapper { 
            border-radius: 1rem; 
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); 
            border: 1px solid rgba(0,0,0,0.05);
        }
        .leaflet-popup-tip { display: none; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}