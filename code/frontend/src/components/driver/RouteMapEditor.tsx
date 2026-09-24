import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Search,
  Plus,
  Trash2,
  Navigation,
  Loader2,
  ArrowDown,
} from "lucide-react";

// Fix Leaflet asset paths in bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface RouteStop {
  name: string;
  latitude: number;
  longitude: number;
}

interface RouteMapEditorProps {
  startLocation: RouteStop;
  onStartChange: (stop: RouteStop) => void;
  intermediateStops: RouteStop[];
  onIntermediateChange: (stops: RouteStop[]) => void;
  endLocation: RouteStop;
  onEndChange: (stop: RouteStop) => void;
}

type ActiveTarget = "start" | "end" | number;

function createPinIcon(label: string, color: string, isActive: boolean) {
  const scale = isActive ? 1.15 : 1.0;
  return new L.DivIcon({
    className: "custom-stop-pin",
    html: `
      <div style="
        position: relative;
        transform: translate(-50%, -100%) scale(${scale});
        transition: transform 0.2s ease;
      ">
        <div style="
          width: 36px;
          height: 36px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: ${isActive ? "0 0 0 4px rgba(16,185,129,0.35), 0 6px 14px rgba(0,0,0,0.3)" : "0 4px 10px rgba(0,0,0,0.25)"};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-size: 11px;
            font-weight: 900;
            font-family: sans-serif;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          ">${label}</span>
        </div>
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 5px;
          background: rgba(0,0,0,0.25);
          border-radius: 50%;
          filter: blur(1px);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
}

export default function RouteMapEditor({
  startLocation,
  onStartChange,
  intermediateStops,
  onIntermediateChange,
  endLocation,
  onEndChange,
}: RouteMapEditorProps) {
  const [activeTarget, setActiveTarget] = useState<ActiveTarget>("start");

  // Search autocomplete state for currently focused input
  const [searchFocused, setSearchFocused] = useState<ActiveTarget | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const initialLat = startLocation.latitude || 6.9271;
    const initialLng = startLocation.longitude || 79.8612;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([initialLat, initialLng], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    leafletMapRef.current = map;

    // Click anywhere on map to reposition currently active stop
    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      handleLocationChange(lat, lng, true);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Markers and Polyline whenever stops or activeTarget change
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    const points: [number, number][] = [];

    // Helper to add marker
    const addOrUpdateMarker = (
      key: string,
      target: ActiveTarget,
      stop: RouteStop,
      label: string,
      color: string
    ) => {
      if (!stop.latitude || !stop.longitude) return;

      const isActive = activeTarget === target;
      const marker = L.marker([stop.latitude, stop.longitude], {
        icon: createPinIcon(label, color, isActive),
        draggable: isActive,
        zIndexOffset: isActive ? 1000 : 100,
      }).addTo(map);

      if (isActive) {
        marker.bindTooltip("Drag me to fine-tune location!", {
          permanent: true,
          direction: "top",
          offset: [0, -38],
          className: "bg-slate-900 text-white text-[10px] font-bold rounded-lg px-2 py-1 shadow-md border-0",
        });
      }

      marker.on("dragend", async (e: any) => {
        const pos = e.target.getLatLng();
        handleLocationChange(pos.lat, pos.lng, true);
      });

      marker.on("click", () => {
        setActiveTarget(target);
      });

      markersRef.current[key] = marker;
      points.push([stop.latitude, stop.longitude]);
    };

    // 1. Start Marker
    addOrUpdateMarker("start", "start", startLocation, "A", "#10b981");

    // 2. Intermediate Markers
    intermediateStops.forEach((stop, idx) => {
      addOrUpdateMarker(`inter_${idx}`, idx, stop, `${idx + 1}`, "#3b82f6");
    });

    // 3. End Marker
    addOrUpdateMarker("end", "end", endLocation, "B", "#ef4444");

    // Update connecting polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (points.length >= 2) {
      polylineRef.current = L.polyline(points, {
        color: "#059669",
        weight: 4,
        opacity: 0.8,
        dashArray: "6, 8",
      }).addTo(map);
    }
  }, [startLocation, intermediateStops, endLocation, activeTarget]);

  // Reverse geocode when pin is dragged
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      setIsReverseGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          return data.display_name.split(",").slice(0, 3).join(",");
        }
      }
    } catch {
      // ignore
    } finally {
      setIsReverseGeocoding(false);
    }
    return "";
  };

  // Called when user drags pin on map or clicks map
  const handleLocationChange = async (lat: number, lng: number, updateAddress = false) => {
    let resolvedName = "";
    if (updateAddress) {
      resolvedName = await reverseGeocode(lat, lng);
    }

    if (activeTarget === "start") {
      onStartChange({
        name: resolvedName || startLocation.name || "Starting Point",
        latitude: lat,
        longitude: lng,
      });
    } else if (activeTarget === "end") {
      onEndChange({
        name: resolvedName || endLocation.name || "Destination School",
        latitude: lat,
        longitude: lng,
      });
    } else if (typeof activeTarget === "number") {
      const updated = [...intermediateStops];
      updated[activeTarget] = {
        name: resolvedName || updated[activeTarget]?.name || `Stop ${activeTarget + 1}`,
        latitude: lat,
        longitude: lng,
      };
      onIntermediateChange(updated);
    }
  };

  // Autocomplete search
  const handleSearchTyping = async (query: string, target: ActiveTarget) => {
    setSearchFocused(target);

    // Update stop name immediately as user types
    if (target === "start") {
      onStartChange({ ...startLocation, name: query });
    } else if (target === "end") {
      onEndChange({ ...endLocation, name: query });
    } else if (typeof target === "number") {
      const updated = [...intermediateStops];
      updated[target] = { ...updated[target], name: query };
      onIntermediateChange(updated);
    }

    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=lk`
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (e) {
      console.error("Autocomplete search error:", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item: any, target: ActiveTarget) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const shortName = item.display_name.split(",").slice(0, 3).join(",");

    if (target === "start") {
      onStartChange({ name: shortName, latitude: lat, longitude: lng });
    } else if (target === "end") {
      onEndChange({ name: shortName, latitude: lat, longitude: lng });
    } else if (typeof target === "number") {
      const updated = [...intermediateStops];
      updated[target] = { name: shortName, latitude: lat, longitude: lng };
      onIntermediateChange(updated);
    }

    setSearchResults([]);
    setSearchFocused(null);
    setActiveTarget(target);

    // Center map on chosen location
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], 15, { animate: true });
    }
  };

  const handleAddIntermediate = () => {
    const newIdx = intermediateStops.length;
    const defaultLat = endLocation.latitude || startLocation.latitude || 6.9271;
    const defaultLng = endLocation.longitude || startLocation.longitude || 79.8612;

    const newStop: RouteStop = {
      name: "",
      latitude: defaultLat,
      longitude: defaultLng,
    };

    onIntermediateChange([...intermediateStops, newStop]);
    setActiveTarget(newIdx);
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([defaultLat, defaultLng], 14, { animate: true });
    }
  };

  const handleRemoveIntermediate = (index: number) => {
    const updated = intermediateStops.filter((_, i) => i !== index);
    onIntermediateChange(updated);
    setActiveTarget("start");
  };

  const focusOnStop = (target: ActiveTarget, stop: RouteStop) => {
    setActiveTarget(target);
    if (leafletMapRef.current && stop.latitude && stop.longitude) {
      leafletMapRef.current.setView([stop.latitude, stop.longitude], 15, { animate: true });
    }
  };

  const getTargetTitle = (target: ActiveTarget) => {
    if (target === "start") return "Starting Location (A)";
    if (target === "end") return "End Location / School (B)";
    return `Intermediate Stop #${(target as number) + 1}`;
  };

  const getActiveStop = (): RouteStop => {
    if (activeTarget === "start") return startLocation;
    if (activeTarget === "end") return endLocation;
    return intermediateStops[activeTarget as number] || { name: "", latitude: 0, longitude: 0 };
  };

  const activeStop = getActiveStop();

  return (
    <div className="space-y-6 font-sans">
      {/* Informative Guidance Banner */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
        <Navigation className="text-emerald-600 shrink-0 animate-pulse" size={20} />
        <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
          <strong>How to set up:</strong> Type your place name in the box. Because search locations may not be 100% exact, you can <strong>drag the location pin directly on the map</strong> to fix the precise pickup point!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Stop Text Boxes */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. START LOCATION TEXT BOX */}
          <div
            onClick={() => setActiveTarget("start")}
            className={`p-4 rounded-3xl border-2 transition-all relative ${
              activeTarget === "start"
                ? "bg-emerald-50/70 border-emerald-500 shadow-sm"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                  A
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Starting Location
                </span>
              </div>
              {startLocation.latitude !== 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Pin Active
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={startLocation.name}
                onFocus={() => {
                  setActiveTarget("start");
                  setSearchFocused("start");
                }}
                onChange={(e) => handleSearchTyping(e.target.value, "start")}
                placeholder="Type start place (e.g. Nugegoda, Homagama)..."
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              {searchFocused === "start" && isSearching && (
                <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
              )}

              {/* Suggestions Dropdown */}
              {searchFocused === "start" && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-12 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {searchResults.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => handleSelectSearchResult(item, "start")}
                      className="w-full p-2.5 text-left hover:bg-emerald-50 flex items-start gap-2 text-xs"
                    >
                      <MapPin size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">{item.display_name.split(",")[0]}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{item.display_name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {startLocation.latitude !== 0 && (
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="font-mono">
                  {Number(startLocation.latitude).toFixed(4)}, {Number(startLocation.longitude).toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={() => focusOnStop("start", startLocation)}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Locate on Map
                </button>
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center -my-2 text-slate-300">
            <ArrowDown size={18} />
          </div>

          {/* 2. INTERMEDIATE STOPS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Intermediate Stops ({intermediateStops.length})
              </span>
              <button
                type="button"
                onClick={handleAddIntermediate}
                className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} /> Add Stop
              </button>
            </div>

            {intermediateStops.map((stop, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTarget(idx)}
                className={`p-3.5 rounded-3xl border-2 transition-all relative ${
                  activeTarget === idx
                    ? "bg-blue-50/70 border-blue-500 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Stop #{idx + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveIntermediate(idx);
                    }}
                    className="p-1 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Stop"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={stop.name}
                    onFocus={() => {
                      setActiveTarget(idx);
                      setSearchFocused(idx);
                    }}
                    onChange={(e) => handleSearchTyping(e.target.value, idx)}
                    placeholder={`Type stop #${idx + 1} location...`}
                    className="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  {searchFocused === idx && isSearching && (
                    <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                  )}

                  {/* Autocomplete Dropdown */}
                  {searchFocused === idx && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-11 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-48 overflow-y-auto divide-y divide-slate-50">
                      {searchResults.map((item) => (
                        <button
                          key={item.place_id}
                          type="button"
                          onClick={() => handleSelectSearchResult(item, idx)}
                          className="w-full p-2.5 text-left hover:bg-blue-50 flex items-start gap-2 text-xs"
                        >
                          <MapPin size={12} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.display_name.split(",")[0]}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{item.display_name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {stop.latitude !== 0 && (
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span className="font-mono">
                      {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}
                    </span>
                    <button
                      type="button"
                      onClick={() => focusOnStop(idx, stop)}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      Locate on Map
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center -my-2 text-slate-300">
            <ArrowDown size={18} />
          </div>

          {/* 3. END LOCATION / SCHOOL */}
          <div
            onClick={() => setActiveTarget("end")}
            className={`p-4 rounded-3xl border-2 transition-all relative ${
              activeTarget === "end"
                ? "bg-red-50/70 border-red-500 shadow-sm"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  B
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  End Location / School
                </span>
              </div>
              {endLocation.latitude !== 0 && (
                <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full">
                  Pin Active
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={endLocation.name}
                onFocus={() => {
                  setActiveTarget("end");
                  setSearchFocused("end");
                }}
                onChange={(e) => handleSearchTyping(e.target.value, "end")}
                placeholder="Type destination / school..."
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
              />
              {searchFocused === "end" && isSearching && (
                <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
              )}

              {/* Suggestions Dropdown */}
              {searchFocused === "end" && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-12 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {searchResults.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => handleSelectSearchResult(item, "end")}
                      className="w-full p-2.5 text-left hover:bg-red-50 flex items-start gap-2 text-xs"
                    >
                      <MapPin size={12} className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">{item.display_name.split(",")[0]}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{item.display_name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {endLocation.latitude !== 0 && (
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="font-mono">
                  {Number(endLocation.latitude).toFixed(4)}, {Number(endLocation.longitude).toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={() => focusOnStop("end", endLocation)}
                  className="text-red-700 font-bold hover:underline"
                >
                  Locate on Map
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map with Draggable Pin */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Active Target Banner */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                Currently Adjusting: {getTargetTitle(activeTarget)}
              </span>
            </div>
            {isReverseGeocoding ? (
              <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> Resolving address...
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
                Drag marker or click map
              </span>
            )}
          </div>

          {/* Map Container */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner h-[460px] w-full">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Helper Tag Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">
                  Active Location Pin
                </span>
                <span className="font-bold text-slate-800 truncate block">
                  {activeStop.name || "Select or drag pin to position"}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-emerald-700 block">
                  {activeStop.latitude ? `${Number(activeStop.latitude).toFixed(5)}, ${Number(activeStop.longitude).toFixed(5)}` : "Not set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
