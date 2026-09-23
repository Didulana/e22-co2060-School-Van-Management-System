import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Search, Navigation, Check, X, Loader2 } from "lucide-react";

// Fix standard Leaflet default icon paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pinIcon = new L.DivIcon({
  className: "custom-div-icon",
  html: `
    <div style="
      position: relative;
      width: 38px;
      height: 38px;
      transform: translate(-50%, -100%);
    ">
      <div style="
        width: 38px;
        height: 38px;
        background: radial-gradient(circle at 30% 30%, #10b981, #047857);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 12px; height: 12px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 14px;
        height: 6px;
        background: rgba(0,0,0,0.25);
        border-radius: 50%;
        filter: blur(1px);
      "></div>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

interface DraggableLocationPickerProps {
  title: string;
  initialName?: string;
  initialLat?: number;
  initialLng?: number;
  onConfirm: (name: string, lat: number, lng: number) => void;
  onCancel: () => void;
}

export default function DraggableLocationPicker({
  title,
  initialName = "",
  initialLat,
  initialLng,
  onConfirm,
  onCancel,
}: DraggableLocationPickerProps) {
  const [name, setName] = useState(initialName);
  const [lat, setLat] = useState<number>(initialLat || 6.9271);
  const [lng, setLng] = useState<number>(initialLng || 79.8612);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const defaultLat = initialLat && initialLat !== 0 ? initialLat : 6.9271;
    const defaultLng = initialLng && initialLng !== 0 ? initialLng : 79.8612;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([defaultLat, defaultLng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([defaultLat, defaultLng], {
      icon: pinIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.on("dragend", async (e) => {
      const position = e.target.getLatLng();
      setLat(position.lat);
      setLng(position.lng);
      await reverseGeocode(position.lat, position.lng);
    });

    map.on("click", async (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
      await reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    leafletMapRef.current = map;
    markerRef.current = marker;

    // Small delay to ensure map renders tiles properly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setIsReverseGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const shortName = data.display_name.split(",").slice(0, 3).join(",");
          setName(shortName);
        }
      }
    } catch {
      // Ignore network failures for geocoding
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    try {
      setIsSearching(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&countrycodes=lk`
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: any) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lon);
    const displayName = item.display_name.split(",").slice(0, 3).join(",");

    setLat(newLat);
    setLng(newLng);
    setName(displayName);
    setSearchResults([]);
    setSearchQuery("");

    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([newLat, newLng], 16);
      markerRef.current.setLatLng([newLat, newLng]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-slate-900">{title}</h3>
              <p className="text-xs text-slate-400 font-medium">
                Search place name, then drag the pin to set the exact position.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-4 relative">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type location name (e.g. Nugegoda, Kandy Road, Colombo 03)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shrink-0"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-16 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-56 overflow-y-auto divide-y divide-slate-50">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  onClick={() => selectSearchResult(item)}
                  className="w-full p-3.5 text-left hover:bg-emerald-50/60 transition-colors flex items-start gap-2.5 text-xs"
                >
                  <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {item.display_name.split(",")[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.display_name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="relative my-4 rounded-3xl overflow-hidden border border-slate-200 shadow-inner flex-1 min-h-[260px]">
          <div ref={mapContainerRef} className="w-full h-full min-h-[260px]" />
          <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm text-[10px] font-black text-emerald-800 flex items-center gap-1.5">
            <Navigation size={12} className="text-emerald-600 animate-pulse" />
            Drag pin or tap map to reposition
          </div>
        </div>

        {/* Selected Location Info */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                Stop / Landmark Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Give this stop a name..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-right shrink-0 pt-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Coordinates</span>
              <span className="text-xs font-mono font-bold text-slate-700">
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </span>
              {isReverseGeocoding && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <Loader2 size={10} className="animate-spin" /> Resolving address...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim() || lat === 0}
            onClick={() => onConfirm(name.trim(), lat, lng)}
            className="px-7 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            <Check size={16} /> Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
