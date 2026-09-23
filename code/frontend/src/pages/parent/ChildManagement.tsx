import { useEffect, useState, useRef } from "react";
import {
  getChildren,
  registerChild,
  updateChild,
  getAvailableRoutes,
  getDriversBySchool,
  getSchools,
  getRouteByDriverId,
  Child,
  Route,
  getAbsences,
  markAbsent,
  cancelAbsence,
} from "../../services/parentService";
import {
  UserPlus,
  UserCircle,
  Plus,
  ChevronRight,
  Edit3,
  MapPin,
  School as SchoolIcon,
  ShieldCheck,
  X,
  Navigation,
  Calendar,
  Camera,
  Search,
  CheckCircle2,
  Zap,
} from "lucide-react";
import StopSelectorMap from "../../components/parent/StopSelectorMap";

interface School {
  id: number;
  name: string;
  city?: string;
  address?: string;
}

interface SchoolDriver {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  profile_image?: string;
  license_number?: string;
  vehicle_type?: string;
  vehicle_registration_number?: string;
  capacity?: number;
  is_ac?: boolean;
  active_students?: number;
  remaining_seats?: number;
  route_id?: number;
}

export default function ChildManagement() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedRoute, setFetchedRoute] = useState<Route | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);

  // Registered schools and driver filter by school
  const [registeredSchools, setRegisteredSchools] = useState<School[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [schoolDrivers, setSchoolDrivers] = useState<SchoolDriver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // Absence modal state
  const [absenceModalChild, setAbsenceModalChild] = useState<Child | null>(null);
  const [absences, setAbsences] = useState<any[]>([]);
  const [absenceForm, setAbsenceForm] = useState({ date: "", session_type: "both", reason: "" });
  const [absenceLoading, setAbsenceLoading] = useState(false);
  const [absenceError, setAbsenceError] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    preferred_name: "",
    school: "",
    dob: "",
    grade: "",
    portrait_photo: "",
    driver_id: "",
    pickup_stop_id: "",
    dropoff_stop_id: "",
    pickup_lat: 0,
    pickup_lng: 0,
    dropoff_lat: 0,
    dropoff_lng: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [kids, routes, schools] = await Promise.all([
        getChildren(),
        getAvailableRoutes(),
        getSchools().catch(() => []),
      ]);
      setChildren(kids);
      setAvailableRoutes(routes);
      setRegisteredSchools(schools);
    } catch (err) {
      console.error("Failed to load child management data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When school changes, query drivers that cover this school
  const handleSelectSchool = async (schoolName: string) => {
    setFormData((prev) => ({
      ...prev,
      school: schoolName,
      driver_id: "",
      pickup_stop_id: "",
      dropoff_stop_id: "",
    }));
    setSchoolSearchQuery(schoolName);
    setShowSchoolDropdown(false);
    setFetchedRoute(null);

    try {
      setLoadingDrivers(true);
      const drivers = await getDriversBySchool(schoolName);
      setSchoolDrivers(drivers || []);
    } catch (err) {
      console.error("Failed to load drivers for school:", err);
      setSchoolDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleSelectDriver = async (driver: SchoolDriver) => {
    const dIdStr = (driver.route_id || driver.id).toString();
    setFormData((prev) => ({
      ...prev,
      driver_id: dIdStr,
      pickup_stop_id: "",
      dropoff_stop_id: "",
    }));

    // Find or fetch route
    let route = availableRoutes.find((r) => r.id.toString() === dIdStr);
    if (!route) {
      try {
        route = await getRouteByDriverId(driver.id);
      } catch (err) {
        console.error("Could not fetch route for driver:", err);
      }
    }
    setFetchedRoute(route || null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        portrait_photo: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Child> = {
        name: formData.name,
        preferred_name: formData.preferred_name || undefined,
        school: formData.school,
        dob: formData.dob || undefined,
        grade: formData.grade || undefined,
        portrait_photo: formData.portrait_photo || undefined,
        pickup_stop_id: parseInt(formData.pickup_stop_id) || 0,
        dropoff_stop_id: parseInt(formData.dropoff_stop_id) || 0,
        pickup_lat: formData.pickup_lat || 0,
        pickup_lng: formData.pickup_lng || 0,
        dropoff_lat: formData.dropoff_lat || 0,
        dropoff_lng: formData.dropoff_lng || 0,
      };

      if (editingChild) {
        await updateChild(editingChild.id, payload);
      } else {
        await registerChild(payload);
      }

      setShowForm(false);
      setEditingChild(null);
      setFetchedRoute(null);
      resetForm();
      loadData();
    } catch (err) {
      alert("Failed to commit student data. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      preferred_name: "",
      school: "",
      dob: "",
      grade: "",
      portrait_photo: "",
      driver_id: "",
      pickup_stop_id: "",
      dropoff_stop_id: "",
      pickup_lat: 0,
      pickup_lng: 0,
      dropoff_lat: 0,
      dropoff_lng: 0,
    });
    setSchoolSearchQuery("");
    setSchoolDrivers([]);
  };

  const handleEdit = async (child: Child) => {
    setEditingChild(child);
    const dId = child.driver_id?.toString() || "";

    setFormData({
      name: child.name,
      preferred_name: child.preferred_name || "",
      school: child.school || "",
      dob: child.dob ? child.dob.split("T")[0] : "",
      grade: child.grade || "",
      portrait_photo: child.portrait_photo || "",
      driver_id: dId,
      pickup_stop_id: child.pickup_stop_id?.toString() || "",
      dropoff_stop_id: child.dropoff_stop_id?.toString() || "",
      pickup_lat: child.pickup_lat || 0,
      pickup_lng: child.pickup_lng || 0,
      dropoff_lat: child.dropoff_lat || 0,
      dropoff_lng: child.dropoff_lng || 0,
    });
    setSchoolSearchQuery(child.school || "");

    if (child.school) {
      getDriversBySchool(child.school)
        .then((drivers) => setSchoolDrivers(drivers || []))
        .catch(() => {});
    }

    if (dId) {
      const route = availableRoutes.find((r) => r.id.toString() === dId);
      setFetchedRoute(route || null);
    }

    setShowForm(true);
  };

  const openAbsenceModal = async (child: Child) => {
    setAbsenceModalChild(child);
    setAbsenceError("");
    setAbsenceForm({ date: "", session_type: "both", reason: "" });
    try {
      const data = await getAbsences(child.id);
      setAbsences(data);
    } catch (err) {
      setAbsences([]);
    }
  };

  const handleSubmitAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!absenceModalChild) return;
    setAbsenceLoading(true);
    setAbsenceError("");
    try {
      await markAbsent(
        absenceModalChild.id,
        absenceForm.date,
        absenceForm.session_type,
        absenceForm.reason || undefined
      );
      setAbsenceForm({ date: "", session_type: "both", reason: "" });
      const data = await getAbsences(absenceModalChild.id);
      setAbsences(data);
    } catch (err: any) {
      setAbsenceError("Failed to save absence. Please try again.");
    } finally {
      setAbsenceLoading(false);
    }
  };

  const handleCancelAbsence = async (studentId: number, date: string) => {
    try {
      await cancelAbsence(studentId, date);
      const data = await getAbsences(studentId);
      setAbsences(data);
    } catch (err) {
      alert("Failed to cancel absence.");
    }
  };

  const filteredSchools = registeredSchools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(schoolSearchQuery.toLowerCase()))
  );

  if (loading)
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-[6px] border-slate-100 border-t-emerald-500 shadow-xl" />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-300">Syncing Database</p>
      </div>
    );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-sans">
      {/* Absence Management Modal */}
      {absenceModalChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAbsenceModalChild(null)} />
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-500">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-amber-500">
                  <Calendar size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Manage Absences</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                    {absenceModalChild.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAbsenceModalChild(null)}
                className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {/* Mark New Absence Form */}
              <div className="px-8 py-6 border-b border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                  Mark New Absence
                </p>
                <form onSubmit={handleSubmitAbsence} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                      Date
                    </label>
                    <input
                      required
                      type="date"
                      value={absenceForm.date}
                      onChange={(e) => setAbsenceForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      Journey
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["morning", "afternoon", "both"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAbsenceForm((f) => ({ ...f, session_type: s }))}
                          className={`rounded-2xl py-2.5 text-xs font-black transition-all capitalize border ${
                            absenceForm.session_type === s
                              ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-100"
                              : "bg-white text-slate-500 border-slate-100 hover:border-amber-300 hover:text-amber-600"
                          }`}
                        >
                          {s === "morning" ? "🌅 Morning" : s === "afternoon" ? "🌇 Afternoon" : "📅 Both"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                      Reason (optional)
                    </label>
                    <input
                      type="text"
                      value={absenceForm.reason}
                      onChange={(e) => setAbsenceForm((f) => ({ ...f, reason: e.target.value }))}
                      placeholder="e.g. Doctor's appointment"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                    />
                  </div>
                  {absenceError && <p className="text-xs font-bold text-red-500">{absenceError}</p>}
                  <button
                    type="submit"
                    disabled={absenceLoading}
                    className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-black text-white shadow-xl shadow-amber-100 hover:bg-amber-600 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {absenceLoading ? "Saving..." : "Save Absence"}
                  </button>
                </form>
              </div>

              {/* Existing Absences List */}
              <div className="px-8 py-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                  Recorded Absences
                </p>
                {absences.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-200">
                      <Calendar size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-400">No absences recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {absences.map((ab) => (
                      <div
                        key={ab.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-3 group hover:bg-white hover:shadow-soft transition-all"
                      >
                        <div>
                          <p className="text-sm font-black text-slate-800">{ab.absence_date}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                ab.session_type === "morning"
                                  ? "bg-amber-100 text-amber-700"
                                  : ab.session_type === "afternoon"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {ab.session_type}
                            </span>
                            {ab.reason && (
                              <span className="text-[10px] text-slate-400 font-bold truncate">{ab.reason}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelAbsence(absenceModalChild.id, ab.absence_date)}
                          title="Cancel this absence"
                          className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">My Children</h1>
          <p className="mt-4 text-lg font-medium text-slate-400 capitalize flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} />
            Manage your student profiles, van routes, and school transport
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingChild(null);
              resetForm();
              setShowForm(true);
            }}
            className="group flex items-center gap-3 rounded-[2rem] bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-slate-200 transition-all hover:bg-emerald-600 hover:shadow-emerald-200 active:scale-95"
          >
            <Plus size={18} />
            Add Child
            <ChevronRight size={16} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* ADD / EDIT CHILD FORM */}
      {showForm && (
        <div className="overflow-hidden rounded-[3rem] bg-white shadow-premium border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between border-b border-slate-100 px-10 py-8 bg-slate-50/40">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-slate-100">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  {editingChild ? "Edit Student Profile" : "Enroll New Student"}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Step 1: Child details • Step 2: Select School & Driver • Step 3: Route Stops
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* Section 1: Child Basic Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">1. Student Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo upload preview */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200/80">
                  <div className="relative group cursor-pointer mb-3" onClick={() => photoInputRef.current?.click()}>
                    {formData.portrait_photo ? (
                      <img
                        src={formData.portrait_photo}
                        alt="Student portrait"
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-emerald-400 group-hover:text-emerald-600 transition-colors">
                        <Camera size={28} />
                        <span className="text-[9px] font-bold mt-1">Upload Photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} />
                    </div>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portrait Photo</span>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 font-bold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-50 text-sm"
                        placeholder="e.g. Kasun Mihiranga Perera"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Preferred Name (Calling Name)
                      </label>
                      <input
                        value={formData.preferred_name}
                        onChange={(e) => setFormData({ ...formData, preferred_name: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 font-bold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-50 text-sm"
                        placeholder="e.g. Kasun"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 font-bold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-50 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Grade / Class
                      </label>
                      <input
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 font-bold focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-50 text-sm"
                        placeholder="e.g. Grade 5B"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: School Selection with Search */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                2. Select School & Available Drivers
              </h3>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  School <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={schoolSearchQuery}
                    onChange={(e) => {
                      setSchoolSearchQuery(e.target.value);
                      setShowSchoolDropdown(true);
                    }}
                    onFocus={() => setShowSchoolDropdown(true)}
                    placeholder="Type to search registered schools..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

                {showSchoolDropdown && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-56 overflow-y-auto divide-y divide-slate-50 animate-in fade-in duration-200">
                    {filteredSchools.length === 0 ? (
                      <div className="p-4 text-xs text-slate-400 text-center font-semibold">
                        No registered schools matching &ldquo;{schoolSearchQuery}&rdquo;.
                      </div>
                    ) : (
                      filteredSchools.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSelectSchool(s.name)}
                          className="w-full px-5 py-3 text-left hover:bg-emerald-50 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 block">
                              {s.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{s.city || s.address}</span>
                          </div>
                          <CheckCircle2 size={16} className="text-slate-300 group-hover:text-emerald-600" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Drivers available for selected school */}
              {formData.school && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Available Van Drivers for {formData.school}
                    </span>
                    {loadingDrivers && (
                      <span className="text-xs text-emerald-600 font-bold animate-pulse">Finding drivers...</span>
                    )}
                  </div>

                  {schoolDrivers.length === 0 && !loadingDrivers ? (
                    <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-center">
                      <p className="text-xs font-bold text-amber-800">
                        No approved drivers are currently mapped to this school.
                      </p>
                      <p className="text-[10px] text-amber-600 mt-1">
                        You can still choose any active route from the fallback dropdown below.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {schoolDrivers.map((driver) => {
                        const isSelected = formData.driver_id === (driver.route_id || driver.id).toString();
                        return (
                          <div
                            key={driver.id}
                            onClick={() => handleSelectDriver(driver)}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-emerald-50 border-emerald-500 shadow-md"
                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              {driver.profile_image ? (
                                <img
                                  src={driver.profile_image}
                                  alt={driver.name}
                                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                  {driver.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{driver.name}</h4>
                                <span className="text-[10px] text-slate-400 font-semibold">{driver.phone}</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 text-[11px] bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase text-[9px]">Vehicle:</span>
                                <span className="font-bold text-slate-800">
                                  {driver.vehicle_registration_number || "Van"} ({driver.vehicle_type || "Van"})
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[9px]">Air Condition:</span>
                                <span
                                  className={`font-black text-[10px] uppercase flex items-center gap-0.5 ${
                                    driver.is_ac ? "text-emerald-600" : "text-slate-400"
                                  }`}
                                >
                                  {driver.is_ac ? <Zap size={10} className="fill-emerald-500" /> : null}
                                  {driver.is_ac ? "A/C Active" : "Non A/C"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold uppercase text-[9px]">Available Seats:</span>
                                <span className="font-black text-emerald-700">
                                  {driver.remaining_seats !== undefined
                                    ? `${Math.max(0, driver.remaining_seats)} seats free`
                                    : `${driver.capacity || 12} total`}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-end">
                              <span
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                  isSelected ? "bg-emerald-600 text-white" : "text-slate-400 bg-slate-100"
                                }`}
                              >
                                {isSelected ? "Selected Driver" : "Tap to Select"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Interactive Pickup and Dropoff Map Stops */}
            {fetchedRoute && (
              <div className="space-y-8 pt-6 border-t border-slate-100 animate-in fade-in duration-500">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  3. Select Pickup & Drop-off Stops on Driver Route
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Morning Pickup Location
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <StopSelectorMap
                      label="Select Pickup Stop"
                      stops={fetchedRoute.stops}
                      initialLat={formData.pickup_lat}
                      initialLng={formData.pickup_lng}
                      onPointSelect={(lat, lng, stopId) =>
                        setFormData((prev) => ({
                          ...prev,
                          pickup_lat: lat,
                          pickup_lng: lng,
                          pickup_stop_id: stopId.toString(),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Afternoon Drop-off Location
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <StopSelectorMap
                      label="Select Drop-off Stop"
                      stops={fetchedRoute.stops}
                      initialLat={formData.dropoff_lat}
                      initialLng={formData.dropoff_lng}
                      onPointSelect={(lat, lng, stopId) =>
                        setFormData((prev) => ({
                          ...prev,
                          dropoff_lat: lat,
                          dropoff_lng: lng,
                          dropoff_stop_id: stopId.toString(),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit & Cancel */}
            <div className="mt-10 flex items-center justify-end gap-6 border-t border-slate-100 pt-8">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
              >
                {editingChild ? "Save Changes" : "Save Student & Route Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHILDREN CARDS LIST */}
      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3rem] bg-white p-24 shadow-premium border border-slate-50 text-center animate-in zoom-in-95">
          <div className="mb-8 h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 mx-auto shadow-inner border border-slate-50">
            <UserCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">No children added yet</h2>
          <p className="mt-3 text-slate-400 font-medium max-w-sm mx-auto">
            Add your child's information to match with school van drivers and track them in real time.
          </p>
          <button
            onClick={() => {
              setEditingChild(null);
              resetForm();
              setShowForm(true);
            }}
            className="mt-10 rounded-2xl bg-emerald-500 px-10 py-5 text-base font-black text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-600 active:scale-95"
          >
            Add Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {children.map((child) => (
            <div key={child.id} className="premium-card group relative p-8 rounded-[2.5rem]">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  {child.portrait_photo ? (
                    <img
                      src={child.portrait_photo}
                      alt={child.name}
                      className="h-16 w-16 rounded-[1.5rem] object-cover border-2 border-emerald-400 shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                      <UserCircle size={38} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{child.name}</h3>
                    {child.preferred_name && (
                      <span className="text-xs text-slate-400 font-bold block mt-1">
                        Called: &ldquo;{child.preferred_name}&rdquo;
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-xs font-bold text-slate-500">
                      <SchoolIcon size={14} className="text-emerald-600" />
                      <span>{child.school || "School Not Set"}</span>
                      {child.grade && <span className="text-slate-400">• Grade {child.grade}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(child)}
                  className="h-11 w-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm transition-all"
                  title="Edit Child"
                >
                  <Edit3 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100 group-hover:bg-white transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-emerald-600 border border-slate-100 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Morning Pickup</p>
                      <p className="text-xs font-black text-slate-800 tracking-tight truncate">
                        {child.pickup_stop_name || "Pickup stop unconfigured"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100 group-hover:bg-white transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-blue-600 border border-slate-100 shrink-0">
                      <Navigation size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Afternoon Dropoff</p>
                      <p className="text-xs font-black text-slate-800 tracking-tight truncate">
                        {child.dropoff_stop_name || "Drop-off stop unconfigured"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      child.route_name ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                    }`}
                  />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {child.route_name || (child.driver_id ? `Assigned Driver #${child.driver_id}` : "No driver assigned")}
                  </span>
                </div>
                <button
                  onClick={() => openAbsenceModal(child)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all active:scale-95"
                >
                  <Calendar size={13} />
                  Absences
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
