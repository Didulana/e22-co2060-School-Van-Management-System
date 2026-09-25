import { FormEvent, useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { API_BASE_URL } from "../../config/api";
import {
  UserCircle,
  ShieldCheck,
  Truck,
  Camera,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Upload,
  Zap,
  FileImage,
  BusFront,
  Sparkles,
} from "lucide-react";

const SRI_LANKAN_PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const VEHICLE_TYPES = ["Van", "Mini Bus", "Standard Bus"];

interface DriverForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  nic: string;
  address: string;
  province: string;
  dob: string;
  selfie_url: string;
  license_number: string;
  license_image: string;
  license_expiry: string;
  vehicle_registration: string;
  vehicle_type: string;
  seat_count: number;
  is_ac: boolean;
}

interface ParentForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  nic: string;
  address: string;
  province: string;
  guardian_type: string;
}

const emptyDriverForm: DriverForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  nic: "",
  address: "",
  province: "",
  dob: "",
  selfie_url: "",
  license_number: "",
  license_image: "",
  license_expiry: "",
  vehicle_registration: "",
  vehicle_type: "Van",
  seat_count: 12,
  is_ac: false,
};

const emptyParentForm: ParentForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  nic: "",
  address: "",
  province: "",
  guardian_type: "Father",
};

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: any) => void;
  placeholder?: string;
  required?: boolean;
  icon?: any;
}

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  icon: Icon,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-white/10 bg-white/5 ${
            Icon ? "pl-11" : "px-4"
          } pr-4 py-3.5 text-sm font-semibold text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`}
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, session } = useAuth();

  useEffect(() => {
    if (session) {
      const roleHome: Record<string, string> = {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/parent",
      };
      navigate(roleHome[session.user.role] || "/parent", { replace: true });
    }
  }, [session, navigate]);

  const [role, setRole] = useState<"parent" | "driver" | null>(null);
  const [driverStep, setDriverStep] = useState(1);
  const [driverForm, setDriverForm] = useState<DriverForm>(emptyDriverForm);
  const [parentForm, setParentForm] = useState<ParentForm>(emptyParentForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const selfieInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "selfie_url" | "license_image") {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDriverForm((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function validateDriverStep(step: number): string | null {
    if (step === 1) {
      if (!driverForm.name.trim() || driverForm.name.length < 3) return "Name must be at least 3 characters.";
      if (!/^\d{9}[VvXx]$|^\d{12}$/.test(driverForm.nic))
        return "Enter a valid NIC (e.g., 200012345678 or 123456789V).";
      if (!driverForm.address.trim()) return "Address is required.";
      if (!driverForm.province) return "Please select a province.";
      if (!driverForm.dob) return "Date of birth is required.";
      if (!driverForm.phone || !/^[0-9]{10}$/.test(driverForm.phone)) return "Phone must be 10 digits.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverForm.email)) return "Enter a valid email.";
      if (!driverForm.password || driverForm.password.length < 6) return "Password must be at least 6 characters.";
    }
    if (step === 2) {
      if (!driverForm.license_number.trim()) return "License number is required.";
      if (!driverForm.license_expiry) return "License expiry date is required.";
    }
    if (step === 3) {
      if (!driverForm.vehicle_registration.trim()) return "Vehicle registration number is required.";
      if (driverForm.seat_count < 1) return "Seat count must be at least 1.";
    }
    return null;
  }

  function validateParentForm(): string | null {
    if (!parentForm.name.trim() || parentForm.name.length < 3) return "Name must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentForm.email)) return "Enter a valid email.";
    if (!parentForm.phone || !/^[0-9]{10}$/.test(parentForm.phone)) return "Phone must be 10 digits.";
    if (!parentForm.password || parentForm.password.length < 6) return "Password must be at least 6 characters.";
    if (!parentForm.nic.trim()) return "NIC is required.";
    if (!parentForm.address.trim()) return "Address is required.";
    if (!parentForm.province) return "Please select a province.";
    return null;
  }

  async function handleDriverSubmit() {
    const err = validateDriverStep(3);
    if (err) {
      setErrorMessage(err);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...driverForm, role: "driver" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || "Registration failed");
      setRegistrationComplete(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleParentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const err = validateParentForm();
    if (err) {
      setErrorMessage(err);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parentForm, role: "parent" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || "Registration failed");
      login({ token: data.token, user: data.user });
      navigate("/parent", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Driver registration complete → show pending approval
  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center px-6 relative">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-700 p-8 rounded-3xl bg-[#0c1524]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Application Submitted!</h1>
          <p className="mt-3 text-slate-400 text-sm font-medium leading-relaxed">
            Your driver profile is currently under admin verification. Once your license credentials are confirmed, you will receive full access.
          </p>
          <div className="mt-6 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <p className="text-xs font-bold text-amber-300">Approval usually takes 1 business day</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl font-black text-sm hover:brightness-110 transition-all"
          >
            Go to Portal Sign In
          </button>
        </div>
      </div>
    );
  }

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-12 px-6 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px]" />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-lg animate-in fade-in duration-700">
          {/* Top Brand Link */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#0b121e] rounded-2xl flex items-center justify-center">
                  <BusFront className="text-emerald-400 w-6 h-6" />
                </div>
              </div>
              <span className="font-display font-black text-3xl text-white tracking-tight">
                Kids<span className="text-emerald-400">Route</span>
              </span>
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Sparkles size={12} />
              <span>Create Free Account</span>
            </div>
            <h2 className="mt-4 text-center text-3xl font-black text-white tracking-tight">Choose Your Role</h2>
            <p className="mt-1 text-center text-sm text-slate-400">Select how you will be using the KidsRoute network</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Parent Card */}
            <button
              onClick={() => setRole("parent")}
              className="group p-8 bg-[#0c1524]/90 rounded-3xl border border-white/10 hover:border-emerald-500/50 hover:bg-[#0f1b2d] shadow-xl hover:shadow-emerald-500/10 transition-all text-left active:scale-[0.98] cursor-pointer"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <UserCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center justify-between">
                <span>Parent / Guardian</span>
                <ChevronRight size={18} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Track your children's school van live on the map, receive instant pickup alerts, and manage fees.
              </p>
            </button>

            {/* Driver Card */}
            <button
              onClick={() => setRole("driver")}
              className="group p-8 bg-[#0c1524]/90 rounded-3xl border border-white/10 hover:border-amber-500/50 hover:bg-[#0f1b2d] shadow-xl hover:shadow-amber-500/10 transition-all text-left active:scale-[0.98] cursor-pointer"
            >
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center justify-between">
                <span>School Van Driver</span>
                <ChevronRight size={18} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Configure your daily route map pins, take digital student attendance, and broadcast emergency alerts.
              </p>
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
              Sign in to Portal
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // PARENT FORM
  if (role === "parent") {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-12 px-6 relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setRole(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} /> Choose different role
            </button>
            <Link to="/login" className="text-xs font-bold text-emerald-400 hover:underline">
              Already registered? Sign In
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <UserCircle size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Parent Account Setup</h2>
              <p className="text-xs text-slate-400 font-medium">Instant access to live van tracking after sign up</p>
            </div>
          </div>

          <form
            onSubmit={handleParentSubmit}
            className="bg-[#0c1524]/90 rounded-[2.5rem] border border-white/10 shadow-2xl p-8 space-y-5 backdrop-blur-xl"
          >
            <InputField
              label="Full Name"
              id="p-name"
              value={parentForm.name}
              onChange={(e: any) => setParentForm({ ...parentForm, name: e.target.value })}
              placeholder="e.g. Priyantha Fernando"
              icon={UserCircle}
            />
            <InputField
              label="Email Address"
              id="p-email"
              type="email"
              value={parentForm.email}
              onChange={(e: any) => setParentForm({ ...parentForm, email: e.target.value })}
              placeholder="e.g. parent@example.com"
            />
            <InputField
              label="Phone Number"
              id="p-phone"
              value={parentForm.phone}
              onChange={(e: any) => setParentForm({ ...parentForm, phone: e.target.value })}
              placeholder="0771234567"
            />

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">
                Relationship to Student
              </label>
              <div className="flex gap-2">
                {["Father", "Mother", "Guardian"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setParentForm({ ...parentForm, guardian_type: t })}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${
                      parentForm.guardian_type === t
                        ? "bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md"
                        : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <InputField
              label="NIC Number"
              id="p-nic"
              value={parentForm.nic}
              onChange={(e: any) => setParentForm({ ...parentForm, nic: e.target.value })}
              placeholder="200012345678 or 123456789V"
              icon={CreditCard}
            />
            <InputField
              label="Residential Address"
              id="p-address"
              value={parentForm.address}
              onChange={(e: any) => setParentForm({ ...parentForm, address: e.target.value })}
              placeholder="123 Galle Road, Colombo 03"
              icon={MapPin}
            />

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">Province</label>
              <select
                value={parentForm.province}
                onChange={(e) => setParentForm({ ...parentForm, province: e.target.value })}
                required
                className="w-full rounded-2xl border border-white/10 px-4 py-3.5 text-sm font-semibold text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-[#0a111e]"
              >
                <option value="">Select province...</option>
                {SRI_LANKAN_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Account Password"
              id="p-password"
              type="password"
              value={parentForm.password}
              onChange={(e: any) => setParentForm({ ...parentForm, password: e.target.value })}
              placeholder="••••••••••••"
            />

            {errorMessage && (
              <div className="rounded-2xl bg-red-500/10 p-4 border border-red-500/25">
                <p className="text-xs font-bold text-red-400">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? "Creating account..." : "Complete Parent Registration"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DRIVER MULTI-STEP FORM
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center py-12 px-6 relative">
      <div className="w-full max-w-2xl animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (driverStep > 1) setDriverStep(driverStep - 1);
              else setRole(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> {driverStep > 1 ? "Previous Step" : "Choose different role"}
          </button>
          <Link to="/login" className="text-xs font-bold text-emerald-400 hover:underline">
            Already registered? Sign In
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Truck size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Driver Application</h2>
            <p className="text-xs text-slate-400 font-medium">Step {driverStep} of 3 • Admin verified profile</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-8 relative px-4">
          <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-white/10 -z-10" />
          <div
            className="absolute top-[20px] left-8 h-[2px] bg-emerald-500 -z-10 transition-all duration-700"
            style={{ width: `${(driverStep - 1) * 45}%` }}
          />
          {[
            { n: 1, label: "1. Personal" },
            { n: 2, label: "2. Licence" },
            { n: 3, label: "3. Vehicle" },
          ].map((s) => (
            <div key={s.n} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shadow-lg ${
                  driverStep === s.n
                    ? "bg-white text-slate-950 scale-110 ring-4 ring-emerald-500/30"
                    : driverStep > s.n
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-[#0c1524] text-slate-500 border border-white/10"
                }`}
              >
                {driverStep > s.n ? <CheckCircle2 size={18} /> : s.n}
              </div>
              <span
                className={`mt-2 text-[10px] font-black uppercase tracking-wider ${
                  driverStep >= s.n ? "text-white" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#0c1524]/90 rounded-[2.5rem] border border-white/10 shadow-2xl p-8 backdrop-blur-xl">
          {/* Step 1: Personal Info */}
          {driverStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <InputField
                label="Full Legal Name"
                id="d-name"
                value={driverForm.name}
                onChange={(e: any) => setDriverForm({ ...driverForm, name: e.target.value })}
                placeholder="e.g. Samantha Kumara"
                icon={UserCircle}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="NIC Number"
                  id="d-nic"
                  value={driverForm.nic}
                  onChange={(e: any) => setDriverForm({ ...driverForm, nic: e.target.value })}
                  placeholder="200012345678"
                  icon={CreditCard}
                />
                <InputField
                  label="Date of Birth"
                  id="d-dob"
                  type="date"
                  value={driverForm.dob}
                  onChange={(e: any) => setDriverForm({ ...driverForm, dob: e.target.value })}
                  placeholder=""
                />
              </div>

              <InputField
                label="Permanent Address"
                id="d-address"
                value={driverForm.address}
                onChange={(e: any) => setDriverForm({ ...driverForm, address: e.target.value })}
                placeholder="45 Hospital Road, Kandy"
                icon={MapPin}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">
                    Province
                  </label>
                  <select
                    value={driverForm.province}
                    onChange={(e) => setDriverForm({ ...driverForm, province: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-white/10 px-4 py-3.5 text-sm font-semibold text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-[#0a111e]"
                  >
                    <option value="">Select...</option>
                    {SRI_LANKAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Mobile Contact"
                  id="d-phone"
                  value={driverForm.phone}
                  onChange={(e: any) => setDriverForm({ ...driverForm, phone: e.target.value })}
                  placeholder="0771234567"
                />
              </div>

              {/* Selfie Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">
                  Driver Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {driverForm.selfie_url ? (
                    <img
                      src={driverForm.selfie_url}
                      alt="Selfie"
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-400"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-slate-400">
                      <Camera size={24} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => selfieInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-2"
                  >
                    <Upload size={14} /> Upload Selfie
                  </button>
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "selfie_url")}
                  />
                </div>
              </div>

              <InputField
                label="Email Address"
                id="d-email"
                type="email"
                value={driverForm.email}
                onChange={(e: any) => setDriverForm({ ...driverForm, email: e.target.value })}
                placeholder="driver@example.com"
              />
              <InputField
                label="Create Password"
                id="d-password"
                type="password"
                value={driverForm.password}
                onChange={(e: any) => setDriverForm({ ...driverForm, password: e.target.value })}
                placeholder="••••••••••••"
              />

              {errorMessage && (
                <div className="rounded-2xl bg-red-500/10 p-3 border border-red-500/25">
                  <p className="text-xs font-bold text-red-400">{errorMessage}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const err = validateDriverStep(1);
                  if (err) {
                    setErrorMessage(err);
                    return;
                  }
                  setErrorMessage(null);
                  setDriverStep(2);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Continue: Driving Licence</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Driving Licence */}
          {driverStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <InputField
                label="Driving Licence Number"
                id="d-license"
                value={driverForm.license_number}
                onChange={(e: any) => setDriverForm({ ...driverForm, license_number: e.target.value })}
                placeholder="e.g. B1234567"
                icon={ShieldCheck}
              />
              <InputField
                label="Licence Expiry Date"
                id="d-license-expiry"
                type="date"
                value={driverForm.license_expiry}
                onChange={(e: any) => setDriverForm({ ...driverForm, license_expiry: e.target.value })}
                placeholder=""
              />

              {/* License Image Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">
                  Driver Licence Card Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {driverForm.license_image ? (
                    <img
                      src={driverForm.license_image}
                      alt="License"
                      className="h-16 w-24 rounded-2xl object-cover border-2 border-emerald-400"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-slate-400">
                      <FileImage size={24} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => licenseInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-2"
                  >
                    <Upload size={14} /> Upload Card Photo
                  </button>
                  <input
                    ref={licenseInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "license_image")}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl bg-red-500/10 p-3 border border-red-500/25">
                  <p className="text-xs font-bold text-red-400">{errorMessage}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const err = validateDriverStep(2);
                  if (err) {
                    setErrorMessage(err);
                    return;
                  }
                  setErrorMessage(null);
                  setDriverStep(3);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Continue: Vehicle Specifications</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 3: Vehicle Info */}
          {driverStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <InputField
                label="Vehicle Registration Number"
                id="d-vehicle"
                value={driverForm.vehicle_registration}
                onChange={(e: any) => setDriverForm({ ...driverForm, vehicle_registration: e.target.value })}
                placeholder="WP-CAT-9000"
                icon={Truck}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">
                    Vehicle Type
                  </label>
                  <select
                    value={driverForm.vehicle_type}
                    onChange={(e) => setDriverForm({ ...driverForm, vehicle_type: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 px-4 py-3.5 text-sm font-semibold text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-[#0a111e]"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <InputField
                  label="Passenger Capacity"
                  id="d-seats"
                  type="number"
                  value={driverForm.seat_count}
                  onChange={(e: any) =>
                    setDriverForm({ ...driverForm, seat_count: parseInt(e.target.value) || 0 })
                  }
                  placeholder="12"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <input
                  type="checkbox"
                  checked={driverForm.is_ac}
                  onChange={(e) => setDriverForm({ ...driverForm, is_ac: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  Air Conditioned (A/C) Van
                  <Zap
                    className={`transition-all ${driverForm.is_ac ? "text-amber-400 fill-amber-400" : "text-slate-500"}`}
                    size={14}
                  />
                </span>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <p className="text-xs font-bold text-amber-300">
                  ⚠️ Note: Only students up to the registered capacity limit will be boardable on your daily routes.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-2xl bg-red-500/10 p-3 border border-red-500/25">
                  <p className="text-xs font-bold text-red-400">{errorMessage}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleDriverSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  "Submitting Application..."
                ) : (
                  <>
                    <span>Submit Application for Review</span>
                    <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
