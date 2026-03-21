import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stop } from "../../services/parentService";

interface StopSelectorMapProps {
    stops: Stop[];
    onPointSelect: (lat: number, lng: number, nearestStopId: number) => void;
    initialLat?: number;
    initialLng?: number;
    label: string;
}

const stopIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const selectedIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #f59e0b; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

export default function StopSelectorMap({ stops, onPointSelect, initialLat, initialLng, label }: StopSelectorMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);
    const polylineRef = useRef<L.Polyline | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [pathCoords, setPathCoords] = useState<L.LatLngExpression[]>([]);

    useEffect(() => {
        if (!mapRef.current) return;

        if (!leafletMap.current) {
            leafletMap.current = L.map(mapRef.current, {
                zoomControl: true,
                attributionControl: false
            }).setView([6.9271, 79.8612], 13); // Default to Colombo/Sri Lanka center if no stops

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap.current);
        }

        const map = leafletMap.current;

        // Draw Stops
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker && layer !== markerRef.current) {
                map.removeLayer(layer);
            }
        });

        if (stops.length > 0) {
            const stopMarkers = stops.map(stop => 
                L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
                 .bindPopup(`<b>${stop.name}</b><br>Stop #${stop.order}`)
                 .addTo(map)
            );

            const group = L.featureGroup(stopMarkers);
            map.fitBounds(group.getBounds().pad(0.2));

            // Fetch Road Path from OSRM
            const coordsString = stops
                .sort((a, b) => a.order - b.order)
                .map(s => `${s.longitude},${s.latitude}`)
                .join(";");

            fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
                .then(res => res.json())
                .then(data => {
                    if (data.routes && data.routes[0]) {
                        const geojson = data.routes[0].geometry;
                        const coords = geojson.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
                        setPathCoords(coords);

                        if (polylineRef.current) map.removeLayer(polylineRef.current);
                        
                        polylineRef.current = L.polyline(coords, {
                            color: "#10b981",
                            weight: 5,
                            opacity: 0.6,
                            lineJoin: 'round'
                        }).addTo(map);

                        polylineRef.current.on('click', (e: L.LeafletMouseEvent) => {
                            handleMapClick(e, coords);
                        });
                    }
                })
                .catch(err => console.error("OSRM Route Error:", err));
        }

        const handleMapClick = (e: L.LeafletMouseEvent, currentPath: L.LatLngExpression[]) => {
            if (currentPath.length === 0) return;

            // Simple snapping: find nearest point in the polyline coords
            let minDist = Infinity;
            let snapPoint = e.latlng;
            
            currentPath.forEach((p: any) => {
                const dist = e.latlng.distanceTo(L.latLng(p[0], p[1]));
                if (dist < minDist) {
                    minDist = dist;
                    snapPoint = L.latLng(p[0], p[1]);
                }
            });

            // Find nearest Stop ID
            let nearestStop = stops[0];
            let minStopDist = Infinity;
            stops.forEach(s => {
                const d = snapPoint.distanceTo(L.latLng(s.latitude, s.longitude));
                if (d < minStopDist) {
                    minStopDist = d;
                    nearestStop = s;
                }
            });

            if (markerRef.current) map.removeLayer(markerRef.current);
            markerRef.current = L.marker(snapPoint, { icon: selectedIcon }).addTo(map);
            
            onPointSelect(snapPoint.lat, snapPoint.lng, nearestStop.id);
        };

        map.on('click', (e) => handleMapClick(e, pathCoords));

        if (initialLat && initialLng) {
            if (markerRef.current) map.removeLayer(markerRef.current);
            markerRef.current = L.marker([initialLat, initialLng], { icon: selectedIcon }).addTo(map);
        }

        return () => {
            map.off('click');
        };
    }, [stops, initialLat, initialLng]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Click on the green path to pick your point</span>
            </div>
            <div className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 relative">
                <div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }}></div>
            </div>
        </div>
    );
}
