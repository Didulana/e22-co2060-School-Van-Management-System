import { useEffect, useState } from "react";
import {
  Users,
  Truck,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  XCircle,
  Eye,
  FileText,
  Shield,
  Car,
  Check,
  X,
  Clock,
} from "lucide-react";
import {
  getUsers,
  updateUserStatus,
  getStudents,
  getPendingDrivers,
  getDriverProfile,
} from "../../services/adminService";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"pending" | "parents" | "drivers" | "students">("pending");

  const [parents, setParents] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Driver review modal state
  const [selectedDriverProfile, setSelectedDriverProfile] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (activeTab === "pending") {
        const data = await getPendingDrivers();
        setPendingDrivers(data);
      } else if (activeTab === "parents") {
        const data = await getUsers("parent");
        setParents(data);
      } else if (activeTab === "drivers") {
        const data = await getUsers("driver");
        setDrivers(data);
      } else if (activeTab === "students") {
        const data = await getStudents();
        setStudents(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: number, isApproved: boolean) => {
    try {
      setActionLoading(true);
      await updateUserStatus(userId, isApproved);
      if (selectedDriverProfile && selectedDriverProfile.user_id === userId) {
        setSelectedDriverProfile(null);
      }
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const openDriverProfile = async (driverId: number) => {
    try {
      const profile = await getDriverProfile(driverId);
      setSelectedDriverProfile(profile);
    } catch (err: any) {
      setError(err.message || "Failed to fetch driver profile");
    }
  };

  const renderPendingDrivers = () => (
    <div className="space-y-4">
      {pendingDrivers.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-12 text-center border border-white/60 shadow-soft bg-white/70">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-display text-xl font-black text-slate-900">All caught up!</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">There are no pending driver applications requiring review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingDrivers.map((driver) => (
            <div
              key={driver.id}
              className="glass-card rounded-[2rem] p-6 border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/30 shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {driver.profile_image ? (
                      <img
                        src={driver.profile_image}
                        alt={driver.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
                        {driver.name?.charAt(0) || "D"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-black text-slate-900 text-base leading-tight">{driver.name}</h3>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock size={10} /> Pending Review
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-6 bg-white/80 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">NIC:</span>
                    <span className="font-bold text-slate-800">{driver.nic_no || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Phone:</span>
                    <span className="font-semibold text-slate-700">{driver.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Licence:</span>
                    <span className="font-bold text-slate-800">{driver.license_number || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Vehicle:</span>
                    <span className="font-bold text-slate-800">
                      {driver.vehicle_reg_no ? `${driver.vehicle_reg_no} (${driver.vehicle_type || "Van"})` : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openDriverProfile(driver.id)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Review
                </button>
                <button
                  onClick={() => handleStatusUpdate(driver.user_id, true)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1 shadow-sm"
                  title="Approve driver"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderParentsTable = () => (
    <div className="overflow-x-auto w-full glass-card rounded-[1.75rem] border border-white/60 shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 w-16">ID</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Parent Info</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">NIC & Guardian</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Address</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Contact</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Status</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50">
          {parents.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">No parents found.</td>
            </tr>
          ) : (
            parents.map((user) => (
              <tr key={user.id} className="hover:bg-white/40 transition-colors">
                <td className="p-4 font-bold text-slate-400">#{user.id}</td>
                <td className="p-4">
                  <span className="font-semibold text-slate-900 block">{user.name}</span>
                  <span className="text-[10px] font-bold text-slate-400">{new Date(user.created_at).toLocaleDateString()}</span>
                </td>
                <td className="p-4">
                  <div className="font-bold text-xs text-slate-800">{user.nic_no || "N/A"}</div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {user.guardian_type || "Parent"}
                  </span>
                </td>
                <td className="p-4 max-w-[200px]">
                  <div className="text-xs text-slate-700 truncate">{user.address || "N/A"}</div>
                  <span className="text-[10px] text-slate-400 font-bold">{user.province || ""}</span>
                </td>
                <td className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs">
                    <Phone size={12} className="text-slate-300" />
                    <span>{user.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs">
                    <Mail size={12} className="text-slate-300" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  {user.is_approved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-100">
                      <AlertCircle size={12} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {!user.is_approved ? (
                    <button
                      onClick={() => handleStatusUpdate(user.id, true)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(user.id, false)}
                      className="px-4 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-black border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDriversTable = () => (
    <div className="overflow-x-auto w-full glass-card rounded-[1.75rem] border border-white/60 shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 w-16">ID</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Driver</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">NIC & Contact</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Location</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Status</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50">
          {drivers.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">No drivers found.</td>
            </tr>
          ) : (
            drivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-white/40 transition-colors">
                <td className="p-4 font-bold text-slate-400">#{driver.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {driver.profile_image ? (
                      <img
                        src={driver.profile_image}
                        alt={driver.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        {driver.name?.charAt(0) || "D"}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-900 block">{driver.name}</span>
                      <span className="text-[10px] font-bold text-slate-400">{driver.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 space-y-1">
                  <div className="font-bold text-xs text-slate-800">NIC: {driver.nic_no || "N/A"}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs">
                    <Phone size={12} className="text-slate-300" />
                    <span>{driver.phone || "N/A"}</span>
                  </div>
                </td>
                <td className="p-4 max-w-[200px]">
                  <div className="text-xs text-slate-700 truncate">{driver.address || "N/A"}</div>
                  <span className="text-[10px] text-slate-400 font-bold">{driver.province || ""}</span>
                </td>
                <td className="p-4">
                  {driver.is_approved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-100">
                      <AlertCircle size={12} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openDriverProfile(driver.driver_id || driver.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Eye size={12} /> View Details
                  </button>
                  {!driver.is_approved ? (
                    <button
                      onClick={() => handleStatusUpdate(driver.id, true)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(driver.id, false)}
                      className="px-4 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-black border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderStudentTable = () => (
    <div className="overflow-x-auto w-full glass-card rounded-[1.75rem] border border-white/60 shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 w-16">ID</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Student Info</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">School & Grade</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Parent Info</th>
            <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Assigned Stops</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50">
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">No students registered yet.</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id} className="hover:bg-white/40 transition-colors">
                <td className="p-4 font-bold text-slate-400">#{student.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {student.portrait_photo ? (
                      <img
                        src={student.portrait_photo}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {student.name?.charAt(0) || "S"}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-900 block">{student.name}</span>
                      {student.preferred_name && (
                        <span className="text-xs text-slate-500 block">Called: &ldquo;{student.preferred_name}&rdquo;</span>
                      )}
                      {student.dob && (
                        <span className="text-[10px] text-slate-400 block">DOB: {new Date(student.dob).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-slate-800 block">{student.school}</span>
                  <span className="text-xs text-slate-500 font-medium block">
                    {student.grade ? `Grade ${student.grade}` : "Grade unassigned"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-slate-700 block">{student.parent_name || "Unassigned"}</span>
                  <span className="text-xs text-slate-400 block">{student.parent_phone}</span>
                </td>
                <td className="p-4 space-y-1">
                  <div className="text-xs">
                    <span className="font-bold text-slate-400 uppercase text-[9px] mr-1">Pickup:</span>
                    <span className="font-semibold text-slate-700">{student.pickup_stop || "Not set"}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-400 uppercase text-[9px] mr-1">Dropoff:</span>
                    <span className="font-semibold text-slate-700">{student.dropoff_stop || "Not set"}</span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1420px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Administration</span>
        <h1 className="font-display text-3xl md:text-4xl font-black text-slate-950 tracking-tight">User Management</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-600">
          <XCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
            activeTab === "pending"
              ? "bg-amber-600 text-white shadow-xl shadow-amber-200"
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          <Clock size={18} /> Driver Applications
          {pendingDrivers.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950">
              {pendingDrivers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("parents")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
            activeTab === "parents"
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          <Users size={18} /> Parents
        </button>

        <button
          onClick={() => setActiveTab("drivers")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
            activeTab === "drivers"
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          <Truck size={18} /> All Drivers
        </button>

        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
            activeTab === "students"
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          <GraduationCap size={18} /> Students
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-500"></div>
          <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Loading records...</p>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {activeTab === "pending" && renderPendingDrivers()}
          {activeTab === "parents" && renderParentsTable()}
          {activeTab === "drivers" && renderDriversTable()}
          {activeTab === "students" && renderStudentTable()}
        </div>
      )}

      {/* DRIVER PROFILE REVIEW MODAL */}
      {selectedDriverProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] max-w-3xl w-full p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                {selectedDriverProfile.profile_image ? (
                  <img
                    src={selectedDriverProfile.profile_image}
                    alt={selectedDriverProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">
                    {selectedDriverProfile.name?.charAt(0) || "D"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{selectedDriverProfile.name}</h2>
                    {selectedDriverProfile.is_approved ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                        Pending Approval
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Registered on {new Date(selectedDriverProfile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriverProfile(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Section 1: Personal Info */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Shield size={14} className="text-emerald-600" /> Personal Identification
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">NIC Number</span>
                    <span className="font-black text-slate-900 text-sm">{selectedDriverProfile.nic_no || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Date of Birth</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedDriverProfile.dob ? new Date(selectedDriverProfile.dob).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Phone</span>
                    <span className="font-bold text-slate-800 text-sm">{selectedDriverProfile.phone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                    <span className="font-semibold text-slate-800 text-xs">{selectedDriverProfile.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Residential Address</span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {selectedDriverProfile.address || "N/A"}{" "}
                      {selectedDriverProfile.province ? `(${selectedDriverProfile.province} Province)` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Driving Licence */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-emerald-600" /> Driving Licence Details
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Licence Number</span>
                      <span className="font-black text-slate-900 text-base">{selectedDriverProfile.license_number || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Licence Expiry Date</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {selectedDriverProfile.license_expiry
                          ? new Date(selectedDriverProfile.license_expiry).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {selectedDriverProfile.license_image && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Licence Photo Copy</span>
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-900 flex items-center justify-center">
                        <img
                          src={selectedDriverProfile.license_image}
                          alt="Driving Licence"
                          className="max-h-56 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Vehicle Information */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Car size={14} className="text-emerald-600" /> Vehicle Registration & Specs
                </h4>
                {selectedDriverProfile.vehicle_registration_number ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reg Number</span>
                      <span className="font-black text-slate-900 text-sm">{selectedDriverProfile.vehicle_registration_number}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle Type</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedDriverProfile.vehicle_type || "Van"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Seat Capacity</span>
                      <span className="font-black text-emerald-600 text-sm">{selectedDriverProfile.capacity || 0} Seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Air Conditioned</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {selectedDriverProfile.is_ac ? "Yes (A/C)" : "No (Non-A/C)"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-2xl">No vehicle assigned yet.</p>
                )}
              </div>

              {/* Section 4: Schools Covered */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <GraduationCap size={14} className="text-emerald-600" /> Schools Covered on Route
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  {selectedDriverProfile.schools && selectedDriverProfile.schools.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedDriverProfile.schools.map((school: any) => (
                        <span
                          key={school.id}
                          className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs"
                        >
                          {school.name} {school.city ? `(${school.city})` : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No schools registered for this driver route yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDriverProfile(null)}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              {selectedDriverProfile.is_approved ? (
                <button
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate(selectedDriverProfile.user_id, false)}
                  className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-xs font-black hover:bg-red-100 transition-colors"
                >
                  Revoke Approval
                </button>
              ) : (
                <button
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate(selectedDriverProfile.user_id, true)}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all flex items-center gap-2"
                >
                  <Check size={16} /> Approve Driver Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
