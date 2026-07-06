import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, ClipboardCheck, HeartPulse, Home, MapPin, Pencil, Settings, ShieldCheck, UserCircle, X } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";
import { getHomePath } from "../../features/auth/navigation";
import { ParentProfileDetails } from "../../features/auth/types";

const emptyParentProfile: ParentProfileDetails = {
  phone: "",
  alternatePhone: "",
  relationshipToStudent: "",
  nicOrPassport: "",
  homeAddress: "",
  city: "",
  schoolName: "",
  preferredPickupStop: "",
  preferredDropoffStop: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  notes: "",
};

const requiredParentFields: Array<keyof ParentProfileDetails> = [
  "phone",
  "relationshipToStudent",
  "homeAddress",
  "city",
  "schoolName",
  "preferredPickupStop",
  "preferredDropoffStop",
  "emergencyContactName",
  "emergencyContactPhone",
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const initialParentProfile = {
    ...emptyParentProfile,
    ...(user?.parentProfile || {}),
  };
  const initialParentSetupComplete =
    user?.role !== "parent" || requiredParentFields.every((field) => initialParentProfile[field]?.trim());

  const [isEditing, setIsEditing] = useState(!initialParentSetupComplete);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [parentProfile, setParentProfile] = useState<ParentProfileDetails>(initialParentProfile);
  const [message, setMessage] = useState("");

  const isParent = user?.role === "parent";
  const completedParentFields = requiredParentFields.filter((field) => parentProfile[field]?.trim()).length;
  const profileProgress = Math.round((completedParentFields / requiredParentFields.length) * 100);
  const needsInitialSetup = isParent && completedParentFields < requiredParentFields.length;

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
    setParentProfile({
      ...emptyParentProfile,
      ...(user?.parentProfile || {}),
    });
    setIsEditing(false);
    setMessage("");
  };

  const updateParentField = (field: keyof ParentProfileDetails, value: string) => {
    setParentProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUser({
      name: name.trim() || user?.name,
      email: email.trim() || user?.email,
      ...(isParent
        ? {
            parentProfile: Object.fromEntries(
              Object.entries(parentProfile).map(([key, value]) => [key, value?.trim() || ""])
            ) as ParentProfileDetails,
          }
        : {}),
    });
    setIsEditing(false);
    setMessage(isParent ? "Profile and parent details updated successfully." : "Profile updated successfully.");
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
                <Pencil size={18} /> {needsInitialSetup ? "Complete Setup" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="space-y-5">
            {needsInitialSetup && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="text-amber-600" size={20} />
                  <div>
                    <p className="text-sm font-black text-amber-900">Initial parent setup is incomplete</p>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-amber-700">
                      Add the required contact, school, emergency, and stop details so the transport team can coordinate safely.
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100">
                  <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${profileProgress}%` }} />
                </div>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <Check size={18} /> {message}
              </div>
            )}

            <ProfileSection icon={<UserCircle size={20} />} title="Basic Details">
              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Full Name">
                  <ProfileInput value={name} onChange={setName} disabled={!isEditing} placeholder="Enter your name" />
                </FieldShell>

                <FieldShell label="Email Address">
                  <ProfileInput value={email} onChange={setEmail} disabled={!isEditing} placeholder="Enter your email" type="email" />
                </FieldShell>

                {isParent && (
                  <>
                    <FieldShell label="Mobile Number" required>
                      <ProfileInput value={parentProfile.phone || ""} onChange={(value) => updateParentField("phone", value)} disabled={!isEditing} placeholder="Primary contact number" />
                    </FieldShell>
                    <FieldShell label="Alternate Number">
                      <ProfileInput value={parentProfile.alternatePhone || ""} onChange={(value) => updateParentField("alternatePhone", value)} disabled={!isEditing} placeholder="Optional backup number" />
                    </FieldShell>
                    <FieldShell label="Relationship to Student" required>
                      <ProfileInput value={parentProfile.relationshipToStudent || ""} onChange={(value) => updateParentField("relationshipToStudent", value)} disabled={!isEditing} placeholder="Mother, father, guardian" />
                    </FieldShell>
                    <FieldShell label="NIC / Passport">
                      <ProfileInput value={parentProfile.nicOrPassport || ""} onChange={(value) => updateParentField("nicOrPassport", value)} disabled={!isEditing} placeholder="Identity reference" />
                    </FieldShell>
                  </>
                )}
              </div>
            </ProfileSection>

            {isParent && (
              <>
                <ProfileSection icon={<Home size={20} />} title="Home and School">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell label="Home Address" required wide>
                      <ProfileTextArea value={parentProfile.homeAddress || ""} onChange={(value) => updateParentField("homeAddress", value)} disabled={!isEditing} placeholder="House number, street, area" />
                    </FieldShell>
                    <FieldShell label="City" required>
                      <ProfileInput value={parentProfile.city || ""} onChange={(value) => updateParentField("city", value)} disabled={!isEditing} placeholder="City" />
                    </FieldShell>
                    <FieldShell label="School Name" required>
                      <ProfileInput value={parentProfile.schoolName || ""} onChange={(value) => updateParentField("schoolName", value)} disabled={!isEditing} placeholder="Student school name" />
                    </FieldShell>
                  </div>
                </ProfileSection>

                <ProfileSection icon={<MapPin size={20} />} title="Transport Preferences">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell label="Preferred Pickup Stop" required>
                      <ProfileInput value={parentProfile.preferredPickupStop || ""} onChange={(value) => updateParentField("preferredPickupStop", value)} disabled={!isEditing} placeholder="Pickup stop or landmark" />
                    </FieldShell>
                    <FieldShell label="Preferred Drop-off Stop" required>
                      <ProfileInput value={parentProfile.preferredDropoffStop || ""} onChange={(value) => updateParentField("preferredDropoffStop", value)} disabled={!isEditing} placeholder="Drop-off stop or landmark" />
                    </FieldShell>
                  </div>
                </ProfileSection>

                <ProfileSection icon={<HeartPulse size={20} />} title="Emergency Contact">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell label="Contact Name" required>
                      <ProfileInput value={parentProfile.emergencyContactName || ""} onChange={(value) => updateParentField("emergencyContactName", value)} disabled={!isEditing} placeholder="Emergency contact name" />
                    </FieldShell>
                    <FieldShell label="Contact Phone" required>
                      <ProfileInput value={parentProfile.emergencyContactPhone || ""} onChange={(value) => updateParentField("emergencyContactPhone", value)} disabled={!isEditing} placeholder="Emergency contact phone" />
                    </FieldShell>
                    <FieldShell label="Relationship">
                      <ProfileInput value={parentProfile.emergencyContactRelationship || ""} onChange={(value) => updateParentField("emergencyContactRelationship", value)} disabled={!isEditing} placeholder="Grandparent, aunt, neighbor" />
                    </FieldShell>
                    <FieldShell label="Transport Notes" wide>
                      <ProfileTextArea value={parentProfile.notes || ""} onChange={(value) => updateParentField("notes", value)} disabled={!isEditing} placeholder="Allergies, handover notes, timing notes, or route preferences" />
                    </FieldShell>
                  </div>
                </ProfileSection>
              </>
            )}

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
              {isParent && <Detail label="Setup Progress" value={`${profileProgress}% complete`} />}
              {user?.role === "driver" && (
                <div className="mt-4 pt-4 border-t border-slate-250">
                  <Link
                    to="/driver/payments/settings"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white shadow-soft transition hover:bg-emerald-700"
                  >
                    <Settings size={16} /> System Settings
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </form>
      </section>
    </div>
  );
}

function ProfileSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
      <div className="mb-4 flex items-center gap-2 text-slate-900">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">{icon}</span>
        <h2 className="font-display text-lg font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FieldShell({ label, children, required, wide }: { label: string; children: ReactNode; required?: boolean; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-slate-400">
        {label} {required && <span className="text-emerald-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function ProfileInput({
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      type={type}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-400 disabled:bg-slate-50 disabled:text-slate-500"
      placeholder={placeholder}
    />
  );
}

function ProfileTextArea({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      rows={3}
      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-400 disabled:bg-slate-50 disabled:text-slate-500"
      placeholder={placeholder}
    />
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
