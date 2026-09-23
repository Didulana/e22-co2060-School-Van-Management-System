import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  Crosshair,
} from "lucide-react";

// Fix standard Leaflet default icon paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const schoolPinIcon = new L.DivIcon({
  className: "custom-school-icon",
  html: `
    <div style="
      position: relative;
      width: 44px;
      height: 44px;
      transform: translate(-50%, -100%);
      cursor: grab;
    ">
      <div style="
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%);
        border: 3px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 6px 16px rgba(5, 150, 105, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 6px;
        background: rgba(0,0,0,0.3);
        border-radius: 50%;
        filter: blur(1.5px);
      "></div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

const existingSchoolIcon = new L.DivIcon({
  className: "custom-existing-school-icon",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #475569;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 3px 8px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface ExistingSchool {
  id: number;
  name: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface SchoolMapPickerProps {
  selectedLat?: number;
  selectedLng?: number;
  onCoordinatesChange: (lat: number, lng: number, address?: string, city?: string) => void;
  existingSchools?: ExistingSchool[];
}

const CITY_PRESETS = [
  { name: "Colombo", lat: 6.9271, lng: 79.8612 },
  { name: "Kandy", lat: 7.2906, lng: 80.6337 },
  { name: "Gampaha", lat: 7.084, lng: 79.9926 },
  { name: "Galle", lat: 6.0535, lng: 80.221 },
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623 },
  { name: "Negombo", lat: 7.2008, lng: 79.8736 },
];

export default function SchoolMapPicker({
  selectedLat,
  selectedLng,
  onCoordinatesChange,
  existingSchools = [],
}: SchoolMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const existingMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  // Prevent echoing coordinate updates triggered by internal dragging back into map center
  const isInternalUpdateRef = useRef(false);

  const defaultLat = selectedLat && !isNaN(selectedLat) ? selectedLat : 6.9271;
  const defaultLng = selectedLng && !isNaN(selectedLng) ? selectedLng : 79.8612;

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.municipality ||
            addr.county ||
            addr.state_district ||
            "";

          const streetParts = [
            addr.road || addr.street,
            addr.neighbourhood || addr.residential || addr.suburb,
          ].filter(Boolean);

          const address =
            streetParts.length > 0
              ? streetParts.join(", ")
              : data.display_name?.split(",").slice(0, 3).join(", ").trim() || "";

          onCoordinatesChange(latitude, longitude, address, city);
        } else {
          onCoordinatesChange(latitude, longitude);
        }
      } catch {
        onCoordinatesChange(latitude, longitude);
      }
    },
    [onCoordinatesChange]
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([defaultLat, defaultLng], selectedLat && selectedLng ? 16 : 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const existingGroup = L.layerGroup().addTo(map);
    existingMarkersGroupRef.current = existingGroup;

    // Draggable School Pin
    const marker = L.marker([defaultLat, defaultLng], {
      icon: schoolPinIcon,
      draggable: true,
      autoPan: true,
      zIndexOffset: 1000,
    }).addTo(map);

    marker.on("dragend", async (e) => {
      const pos = e.target.getLatLng();
      isInternalUpdateRef.current = true;
      await reverseGeocode(pos.lat, pos.lng);
      isInternalUpdateRef.current = false;
    });

    map.on("click", async (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      isInternalUpdateRef.current = true;
      await reverseGeocode(e.latlng.lat, e.latlng.lng);
      isInternalUpdateRef.current = false;
    });

    leafletMapRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
      existingMarkersGroupRef.current = null;
    };
  }, []);

  // Update existing schools on map
  useEffect(() => {
    if (!existingMarkersGroupRef.current) return;
    existingMarkersGroupRef.current.clearLayers();

    existingSchools.forEach((school) => {
      if (school.latitude && school.longitude) {
        const marker = L.marker([school.latitude, school.longitude], {
          icon: existingSchoolIcon,
          opacity: 0.8,
        });

        marker.bindTooltip(
          `<strong>${school.name}</strong>${
            school.city ? `<br/><span style="color:#059669;font-size:10px">${school.city}</span>` : ""
          }`,
          { direction: "top", offset: [0, -10] }
        );

        existingMarkersGroupRef.current?.addLayer(marker);
      }
    });
  }, [existingSchools]);

  // Sync external coordinates (from school selection or manual typing in latitude/longitude inputs)
  useEffect(() => {
    if (isInternalUpdateRef.current) return;

    if (
      selectedLat !== undefined &&
      selectedLng !== undefined &&
      !isNaN(selectedLat) &&
      !isNaN(selectedLng) &&
      selectedLat >= -90 &&
      selectedLat <= 90 &&
      selectedLng >= -180 &&
      selectedLng <= 180
    ) {
      if (markerRef.current) {
        markerRef.current.setLatLng([selectedLat, selectedLng]);
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([selectedLat, selectedLng], 16, { animate: true });
      }
    }
  }, [selectedLat, selectedLng]);

  const jumpToCity = (city: (typeof CITY_PRESETS)[0]) => {
    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([city.lat, city.lng], 14, { animate: true });
      markerRef.current.setLatLng([city.lat, city.lng]);
    }
    isInternalUpdateRef.current = true;
    reverseGeocode(city.lat, city.lng);
    isInternalUpdateRef.current = false;
  };

  const jumpToCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 16, { animate: true });
          markerRef.current.setLatLng([latitude, longitude]);
        }
        isInternalUpdateRef.current = true;
        reverseGeocode(latitude, longitude);
        isInternalUpdateRef.current = false;
      },
      (err) => {
        console.warn("Geolocation error:", err);
      }
    );
  };

  return (
    <div className="flex flex-col gap-2.5 h-full">
      {/* City quick jumps & instructions */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Jump to:
          </span>
          {CITY_PRESETS.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => jumpToCity(city)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] border border-slate-200/80 transition-colors shadow-xs"
            >
              {city.name}
            </button>
          ))}
          <button
            type="button"
            onClick={jumpToCurrentLocation}
            title="Use current location"
            className="p-1 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200/80 transition-colors shadow-xs"
          >
            <Crosshair size={13} />
          </button>
        </div>

        <div className="text-[10px] font-bold text-slate-400 shrink-0">
          {existingSchools.length} registered
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex-1 min-h-[320px]">
        <div ref={mapContainerRef} className="w-full h-full min-h-[320px]" />

        {/* Live Pin Instruction Badge */}
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-[11px] font-bold text-slate-700 flex items-center gap-1.5 pointer-events-none">
          <Navigation size={12} className="text-emerald-600 animate-pulse" />
          <span>Drag the green pin to fine-tune exact gate location</span>
        </div>

        {/* Coordinates indicator */}
        {selectedLat !== undefined && selectedLng !== undefined && (
          <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-md text-[10px] font-mono font-bold text-white flex items-center gap-1.5 pointer-events-none">
            <MapPin size={11} className="text-emerald-400" />
            <span>
              {selectedLat.toFixed(5)}, {selectedLng.toFixed(5)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
