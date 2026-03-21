import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
    place_id: number;
}

interface LocationSearchInputProps {
    placeholder: string;
    onSelect: (name: string, lat: number, lon: number) => void;
    initialValue?: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ placeholder, onSelect, initialValue }) => {
    const [query, setQuery] = useState(initialValue || "");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchLocations = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
            );
            const data = await response.json();
            setResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            searchLocations(value);
        }, 500);
    };

    const handleSelect = (result: LocationResult) => {
        setQuery(result.display_name);
        setShowResults(false);
        onSelect(result.display_name, parseFloat(result.lat), parseFloat(result.lon));
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.length >= 3 && setShowResults(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                </div>
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((result) => (
                        <button
                            key={result.place_id}
                            onClick={() => handleSelect(result)}
                            className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                        >
                            <MapPin size={18} className="text-slate-400 mt-1 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{result.display_name.split(',')[0]} {result.display_name.split(',')[1]}</p>
                                <p className="text-xs text-slate-400 line-clamp-1">{result.display_name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showResults && query.length >= 3 && results.length === 0 && !loading && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 text-center text-slate-400 text-sm">
                    No matching locations found.
                </div>
            )}
        </div>
    );
};

export default LocationSearchInput;
