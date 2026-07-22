import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Compass } from 'lucide-react';

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
        <div className="relative w-full font-sans" ref={containerRef}>
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.length >= 3 && setShowResults(true)}
                    placeholder={placeholder}
                    className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 text-slate-900 font-black tracking-tight focus:bg-white focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none text-lg placeholder:text-slate-300 placeholder:font-bold"
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Compass size={24} />}
                </div>
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-4 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-premium border border-white/50 overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Satellite Suggestions</span>
                        <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-4" />
                    </div>
                    {results.map((result) => (
                        <button
                            key={result.place_id}
                            onClick={() => handleSelect(result)}
                            className="w-full px-8 py-5 flex items-start gap-5 hover:bg-emerald-50/50 transition-all border-b border-slate-50 last:border-0 text-left group/item"
                        >
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover/item:bg-emerald-500 group-hover/item:text-white group-hover/item:border-emerald-500 transition-all shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-base font-black text-slate-800 tracking-tight line-clamp-1 group-hover/item:text-emerald-900 transition-colors">
                                    {result.display_name.split(',')[0]} {result.display_name.split(',')[1]}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 line-clamp-1 uppercase tracking-tight mt-1">{result.display_name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showResults && query.length >= 3 && results.length === 0 && !loading && (
                <div className="absolute z-50 w-full mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 text-center animate-in zoom-in-95 duration-200">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-4">
                        <Search size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Coordinates Found</p>
                </div>
            )}
        </div>
    );
};

export default LocationSearchInput;
