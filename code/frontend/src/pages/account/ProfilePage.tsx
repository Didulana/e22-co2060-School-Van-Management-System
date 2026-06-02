import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Mail, Pencil, ShieldCheck, UserCircle, X } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";
import { getHomePath } from "../../features/auth/navigation";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const initials = useMemo(() => {
    return (user?.name || user?.email || user?.role || "U")
      .split(/[ @.]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [user]);

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUser({
      name: name.trim() || user?.name,
      email: email.trim() || user?.email,
    });
    setIsEditing(false);
    setMessage("Profile updated successfully.");
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-soft">
        <div className="bg-slate-950 px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-2xl font-black shadow-xl shadow-emerald-900/30">
                {initials}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Profile Section</p>
                <h1 className="font-display mt-2 text-3xl font-black tracking-tight md:text-4xl">
                  {user?.name || "Your Account"}
                </h1>
                <p className="mt-1 text-sm font-bold text-slate-300">{user?.role} account</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={getHomePath(user?.role)}
                className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/15"
              >
                Home Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setMessage("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-400"
              >
                <Pencil size={18} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="space-y-5">
            {message && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <Check size={18} /> {message}
              </div>
            )}

            <FieldShell icon={<UserCircle size={20} />} label="Full Name">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-400 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter your name"
              />
            </FieldShell>

            <FieldShell icon={<Mail size={20} />} label="Email Address">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!isEditing}
                type="email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-400 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Enter your email"
              />
            </FieldShell>

            {isEditing && (
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  <Check size={18} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-200"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            )}
          </div>

          <aside className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={24} />
            </div>
            <h2 className="font-display text-xl font-black text-slate-950">Account Details</h2>
            <div className="mt-5 space-y-4">
              <Detail label="User ID" value={user?.id ? `#${user.id}` : "Unavailable"} />
              <Detail label="Role" value={user?.role || "User"} />
              <Detail label="Session" value="Signed in" />
            </div>
          </aside>
        </form>
      </section>
    </div>
  );
}

function FieldShell({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black capitalize text-slate-900">{value}</p>
    </div>
  );
}
