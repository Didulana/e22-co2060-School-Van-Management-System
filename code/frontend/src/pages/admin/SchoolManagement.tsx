import { useEffect, useState, useRef } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  MapPin,
  Building2,
  XCircle,
  CheckCircle2,
  Search,
  Loader2,
} from "lucide-react";
import { getSchools, createSchool, deleteSchool } from "../../services/adminService";
import SchoolMapPicker from "../../components/admin/SchoolMapPicker";

interface School {
  id: number;
  name: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export default function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  // Autocomplete dropdown state for School Name input
  const [schoolSuggestions, setSchoolSuggestions] = useState<
    Array<{
      name: string;
      address: string;
      city: string;
      latitude: number;
      longitude: number;
    }>
  >([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchDebounceRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSchools();
      setSchools(data);
    } catch (err: any) {
      setError(err.message || "Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchSchools = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSchoolSuggestions([]);
      return;
    }

    setIsSearchingSchools(true);
    try {
      const queryText =
        trimmed.toLowerCase().includes("school") ||
        trimmed.toLowerCase().includes("college") ||
        trimmed.toLowerCase().includes("vidyalaya")
          ? trimmed
          : `${trimmed} school`;

      let res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryText
        )}&limit=6&countrycodes=lk&addressdetails=1`
      );
      let data = await res.json();

      if (!data || data.length === 0) {
        const broadRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            trimmed
          )}&limit=6&countrycodes=lk&addressdetails=1`
        );
        data = await broadRes.json();
      }

      const parsedResults = (data || []).map((item: any) => {
        const addr = item.address || {};
        const rawName =
          addr.school ||
          addr.amenity ||
          addr.building ||
          item.name ||
          item.display_name?.split(",")[0]?.trim() ||
          "";
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

        const streetParts = [
          addr.road || addr.street,
          addr.neighbourhood || addr.residential || addr.suburb,
        ].filter(Boolean);

        const address =
          streetParts.length > 0
            ? streetParts.join(", ")
            : item.display_name?.split(",").slice(1, 4).join(", ").trim() || "";

        return {
          name: cleanName,
          address,
          city,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        };
      });

      setSchoolSuggestions(parsedResults);
    } catch (err) {
      console.error("Failed to search schools:", err);
      setSchoolSuggestions([]);
    } finally {
      setIsSearchingSchools(false);
    }
  };

  const handleSchoolNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, name: val }));
    setShowDropdown(true);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      searchSchools(val);
    }, 350);
  };

  const handleSelectSchool = (school: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      name: school.name,
      address: school.address || prev.address,
      city: school.city || prev.city,
      latitude: school.latitude ? school.latitude.toFixed(6) : prev.latitude,
      longitude: school.longitude ? school.longitude.toFixed(6) : prev.longitude,
    }));
    setShowDropdown(false);
  };

  const handleUseTypedName = () => {
    setShowDropdown(false);
  };

  const handleCoordinatesChange = (
    lat: number,
    lng: number,
    autoAddress?: string,
    autoCity?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      address: prev.address ? prev.address : (autoAddress || ""),
      city: prev.city ? prev.city : (autoCity || ""),
    }));
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("School name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await createSchool({
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      });

      setSuccess("School added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", address: "", city: "", latitude: "", longitude: "" });
      loadSchools();
      setTimeout(() => setSuccess(""), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to add school");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchool = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the school directory?`)) {
      return;
    }

    try {
      await deleteSchool(id);
      setSuccess(`Removed "${name}"`);
      loadSchools();
      setTimeout(() => setSuccess(""), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to delete school");
    }
  };

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(search.toLowerCase())) ||
      (s.address && s.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-[1420px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Administration</span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-950 tracking-tight">School Directory</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Registered schools covered by van operators and available for parent child enrollment.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-200/80 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} /> Add New School
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-600">
          <XCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by school name, city, or address..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm font-medium placeholder-slate-400 shadow-soft focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
        />
      </div>

      {/* Schools Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-500"></div>
          <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Loading schools...</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full glass-card rounded-[1.75rem] border border-white/60 shadow-soft">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 w-16">ID</th>
                <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">School Name</th>
                <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Address / City</th>
                <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Geo Coordinates</th>
                <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-bold">
                    No schools found. Click &ldquo;Add New School&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-4 font-bold text-slate-400">#{school.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <GraduationCap size={20} />
                        </div>
                        <span className="font-bold text-slate-900">{school.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700 block">{school.address || "N/A"}</span>
                      {school.city && (
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                          {school.city}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {school.latitude && school.longitude ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <MapPin size={12} className="text-emerald-600" />
                          <span>
                            {school.latitude.toFixed(4)}, {school.longitude.toFixed(4)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteSchool(school.id, school.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete school"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black text-slate-900">
                    Register New School
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Type a school name to pick from suggestions, or add custom school and drag the pin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Split Form & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 overflow-y-auto flex-1 pr-1">
              {/* Left Column: School Details Form (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <form id="school-form" onSubmit={handleCreateSchool} className="space-y-4">
                  {/* School Name with Live Autocomplete Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        School Name <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Live search dropdown
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleSchoolNameChange(e.target.value)}
                        onFocus={() => {
                          if (formData.name.trim().length >= 2) setShowDropdown(true);
                        }}
                        placeholder="Type school name (e.g. Royal College, Dharmaraja...)"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300 placeholder:font-normal"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {isSearchingSchools ? (
                          <Loader2 size={16} className="animate-spin text-emerald-600" />
                        ) : (
                          <Search size={16} />
                        )}
                      </div>
                    </div>

                    {/* Autocomplete Dropdown Menu */}
                    {showDropdown && formData.name.trim().length >= 2 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>School Suggestions</span>
                          {isSearchingSchools && (
                            <span className="text-emerald-600 flex items-center gap-1 normal-case font-semibold">
                              <Loader2 size={10} className="animate-spin" /> Searching...
                            </span>
                          )}
                        </div>

                        {/* List of matched schools from search */}
                        {schoolSuggestions.length > 0 ? (
                          schoolSuggestions.map((school, idx) => (
                            <button
                              key={`${school.name}-${idx}`}
                              type="button"
                              onClick={() => handleSelectSchool(school)}
                              className="w-full p-2.5 text-left hover:bg-emerald-50/70 transition-colors flex items-start gap-2.5 group"
                            >
                              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                                <GraduationCap size={15} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-900">
                                    {school.name}
                                  </p>
                                  {school.city && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                                      {school.city}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {school.address || "Sri Lanka"}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : !isSearchingSchools ? (
                          <div className="p-3 text-center text-xs text-slate-400">
                            No matching schools found on map.
                          </div>
                        ) : null}

                        {/* If school doesn't exist, button: "+ Add [The user has typed]" */}
                        <button
                          type="button"
                          onClick={handleUseTypedName}
                          className="w-full p-2.5 text-left hover:bg-emerald-50/80 bg-slate-50 text-emerald-700 font-bold text-xs flex items-center gap-2 transition-colors border-t border-slate-100"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Plus size={13} />
                          </div>
                          <span className="truncate">
                            + Add &ldquo;{formData.name.trim()}&rdquo;
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Address / Street
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Rajakeeya Mawatha, Colombo 07"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Colombo, Kandy, Gampaha"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>

                  {/* Geolocation Section with manual adjustment */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                        <MapPin size={13} className="text-emerald-600" />
                        Coordinates (Adjustable)
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Linked to Map Pin
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) =>
                            setFormData({ ...formData, latitude: e.target.value })
                          }
                          placeholder="6.904200"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={(e) =>
                            setFormData({ ...formData, longitude: e.target.value })
                          }
                          placeholder="79.859600"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      💡 Longitude and latitude update automatically, but you can adjust them manually or drag the map pin.
                    </p>
                  </div>
                </form>

                {/* Footer Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="school-form"
                    disabled={isSubmitting || !formData.name.trim()}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-lg shadow-emerald-200/80 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    {isSubmitting ? "Registering..." : "Save School"}
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Map with Draggable Pin (7 cols) */}
              <div className="lg:col-span-7 flex flex-col min-h-[380px] lg:min-h-[460px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Location Map
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Draggable Pin
                    </span>
                  </div>
                </div>

                <div className="flex-1 rounded-2xl bg-slate-50 p-2.5 border border-slate-100 flex flex-col">
                  <SchoolMapPicker
                    selectedLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
                    selectedLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
                    onCoordinatesChange={handleCoordinatesChange}
                    existingSchools={schools}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
