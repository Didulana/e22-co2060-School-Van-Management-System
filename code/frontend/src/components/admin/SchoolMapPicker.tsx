import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  GraduationCap,
  Loader2,
  Navigation,
  Crosshair,
  Building,
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
      width: 26px;
      height: 26px;
      background: #475569;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 3px 8px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
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
  onLocationSelect: (details: {
    name?: string;
    address?: string;
    city?: string;
    latitude: number;
    longitude: number;
  }) => void;
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
  onLocationSelect,
  existingSchools = [],
}: SchoolMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const existingMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchingArea, setIsSearchingArea] = useState(false);
  const [showExistingSchools, setShowExistingSchools] = useState(true);

  // Track whether coordinates update came from user dragging or parent props
  const isInternalUpdateRef = useRef(false);

  const defaultLat = selectedLat && !isNaN(selectedLat) ? selectedLat : 6.9271;
  const defaultLng = selectedLng && !isNaN(selectedLng) ? selectedLng : 79.8612;

  // Extract clean school information from geocoding object
  const parseGeocodingResult = (item: any) => {
    const addr = item.address || {};
    const rawName =
      addr.school ||
      addr.amenity ||
      addr.building ||
      item.name ||
      item.display_name?.split(",")[0]?.trim() ||
      "";

    // Clean name from generic terms if needed
    const cleanName = rawName.replace(/^school\s+/i, "");

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.suburb ||
      addr.municipality ||
      addr.county ||
      addr.state_district ||
      "";

    // Build street address
    const streetParts = [
      addr.road || addr.street,
      addr.neighbourhood || addr.residential || addr.suburb,
    ].filter(Boolean);

    const address =
      streetParts.length > 0
        ? streetParts.join(", ")
        : item.display_name?.split(",").slice(1, 4).join(",").trim() || "";

    return {
      name: cleanName,
      address,
      city,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };
  };

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number, preserveName = false) => {
      try {
        setIsReverseGeocoding(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        if (res.ok) {
          const data = await res.json();
          const parsed = parseGeocodingResult(data);
          onLocationSelect({
            name: preserveName ? undefined : parsed.name || undefined,
            address: parsed.address || undefined,
            city: parsed.city || undefined,
            latitude,
            longitude,
          });
        } else {
          onLocationSelect({
            latitude,
            longitude,
          });
        }
      } catch (err) {
        console.error("Reverse geocode error:", err);
        onLocationSelect({
          latitude,
          longitude,
        });
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [onLocationSelect]
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

    // Main draggable school marker
    const marker = L.marker([defaultLat, defaultLng], {
      icon: schoolPinIcon,
      draggable: true,
      autoPan: true,
      zIndexOffset: 1000,
    }).addTo(map);

    marker.on("dragend", async (e) => {
      const pos = e.target.getLatLng();
      isInternalUpdateRef.current = true;
      await reverseGeocode(pos.lat, pos.lng, true);
      isInternalUpdateRef.current = false;
    });

    map.on("click", async (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      isInternalUpdateRef.current = true;
      await reverseGeocode(e.latlng.lat, e.latlng.lng, false);
      isInternalUpdateRef.current = false;
    });

    leafletMapRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

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

    if (!showExistingSchools) return;

    existingSchools.forEach((school) => {
      if (school.latitude && school.longitude) {
        const marker = L.marker([school.latitude, school.longitude], {
          icon: existingSchoolIcon,
          opacity: 0.85,
        });

        marker.bindTooltip(
          `<strong>${school.name}</strong>${school.city ? `<br/><span style="color:#059669;font-size:10px">${school.city}</span>` : ""}`,
          { direction: "top", offset: [0, -10] }
        );

        existingMarkersGroupRef.current?.addLayer(marker);
      }
    });
  }, [existingSchools, showExistingSchools]);

  // Sync external coordinates when user manually adjusts latitude or longitude
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
        leafletMapRef.current.panTo([selectedLat, selectedLng], { animate: true });
      }
    }
  }, [selectedLat, selectedLng]);

  // Search Schools via Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    try {
      setIsSearching(true);
      setShowSearchResults(true);

      // Search specifically with school query first or general
      const queryText = searchQuery.toLowerCase().includes("school") ||
        searchQuery.toLowerCase().includes("college") ||
        searchQuery.toLowerCase().includes("vidyalaya")
        ? searchQuery
        : `${searchQuery} school`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryText
        )}&limit=8&countrycodes=lk&addressdetails=1`
      );

      let data = await res.json();

      // If no results, retry with broad search query
      if (!data || data.length === 0) {
        const broadRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=8&countrycodes=lk&addressdetails=1`
        );
        data = await broadRes.json();
      }

      setSearchResults(data || []);
    } catch (err) {
      console.error("School search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Find schools inside the visible map area
  const handleSearchInArea = async () => {
    if (!leafletMapRef.current) return;
    try {
      setIsSearchingArea(true);
      const bounds = leafletMapRef.current.getBounds();
      const minLat = bounds.getSouth();
      const maxLat = bounds.getNorth();
      const minLng = bounds.getWest();
      const maxLng = bounds.getEast();

      // Query schools inside bounded box
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&amenity=school&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&limit=12&addressdetails=1`
      );
      const data = await res.json();
      setSearchResults(data || []);
      setShowSearchResults(true);
    } catch (err) {
      console.error("Area search error:", err);
    } finally {
      setIsSearchingArea(false);
    }
  };

  // Select school from search result
  const handleSelectResult = (item: any) => {
    const parsed = parseGeocodingResult(item);

    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([parsed.lat, parsed.lng], 16, { animate: true });
      markerRef.current.setLatLng([parsed.lat, parsed.lng]);
    }

    onLocationSelect({
      name: parsed.name,
      address: parsed.address,
      city: parsed.city,
      latitude: parsed.lat,
      longitude: parsed.lng,
    });

    setShowSearchResults(false);
    setSearchQuery(parsed.name || "");
  };

  const jumpToCity = (city: (typeof CITY_PRESETS)[0]) => {
    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([city.lat, city.lng], 14, { animate: true });
      markerRef.current.setLatLng([city.lat, city.lng]);
    }
    isInternalUpdateRef.current = true;
    reverseGeocode(city.lat, city.lng, false);
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
        reverseGeocode(latitude, longitude, false);
        isInternalUpdateRef.current = false;
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
      }
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Search Header Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 3) {
                  // Trigger search with small delay if typing
                  const query = e.target.value;
                  const timer = setTimeout(() => {
                    if (query === searchQuery) handleSearch();
                  }, 600);
                  return () => clearTimeout(timer);
                }
              }}
              placeholder="Search school name (e.g. Royal College, Dharmaraja, Visakha, Kandy...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
            {isReverseGeocoding && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                <Loader2 size={11} className="animate-spin" /> Resolving...
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            <span>Find School</span>
          </button>
        </form>

        {/* Dropdown Suggestions */}
        {showSearchResults && (
          <div className="absolute left-0 right-0 top-12 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2.5 bg-slate-50/80 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <GraduationCap size={13} className="text-emerald-600" />
                Schools & Locations Found ({searchResults.length})
              </span>
              <button
                type="button"
                onClick={() => setShowSearchResults(false)}
                className="text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
              >
                Close ✕
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-medium">
                No matching schools found. Try dragging the pin on the map or searching a city/suburb.
              </div>
            ) : (
              searchResults.map((item) => {
                const parsed = parseGeocodingResult(item);
                return (
                  <button
                    key={item.place_id}
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    className="w-full p-3 text-left hover:bg-emerald-50/60 transition-all flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <GraduationCap size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-900">
                          {parsed.name || item.display_name.split(",")[0]}
                        </p>
                        {parsed.city && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                            {parsed.city}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {parsed.address || item.display_name}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quick City Filters & Area Search */}
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
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[11px] transition-colors"
            >
              {city.name}
            </button>
          ))}
          <button
            type="button"
            onClick={jumpToCurrentLocation}
            title="Jump to current location"
            className="p-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors"
          >
            <Crosshair size={13} />
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isSearchingArea}
            onClick={handleSearchInArea}
            className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] transition-colors flex items-center gap-1"
          >
            {isSearchingArea ? <Loader2 size={12} className="animate-spin" /> : <Building size={12} />}
            Schools in View
          </button>

          <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showExistingSchools}
              onChange={(e) => setShowExistingSchools(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
            />
            Existing ({existingSchools.length})
          </label>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex-1 min-h-[300px]">
        <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />

        {/* Live Helper Badge */}
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Navigation size={12} className="text-emerald-600 animate-pulse" />
          <span>Click map or drag green pin to fine-tune school coordinates</span>
        </div>

        {/* Coordinates indicator on bottom right */}
        {selectedLat !== undefined && selectedLng !== undefined && (
          <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-md text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
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
