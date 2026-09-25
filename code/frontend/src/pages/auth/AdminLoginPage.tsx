import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/api";
import { useAuth } from "../../features/auth/AuthContext";
import { ShieldCheck, Mail, Lock, Info, ArrowRight } from "lucide-react";

const emptyCredentials = {
  email: "",
  password: "",
};

function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, login: contextLogin } = useAuth();

  const [credentials, setCredentials] = useState(emptyCredentials);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      if (session.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const roleHome: Record<string, string> = {
          driver: "/driver",
          parent: "/tracking",
        };
        navigate(roleHome[session.user.role] || "/login", { replace: true });
      }
    }
  }, [session, navigate]);

  function validateForm() {
    if (!credentials.email.trim()) {
      return "Email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return "Please enter a valid email address.";
    }
    if (!credentials.password.trim()) {
      return "Password is required.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const nextSession = await login(credentials.email, credentials.password);
      if (nextSession.user.role !== "admin") {
        throw new Error("Access denied. Admin privileges required.");
      }
      contextLogin(nextSession);
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/20 text-white">
            <ShieldCheck size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-400">
          Secure access for system administrators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-2xl shadow-black/50 sm:rounded-3xl sm:px-10 border border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white font-medium focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Admin Email"
                  type="email"
                  value={credentials.email}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white font-medium focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Password"
                  type="password"
                  value={credentials.password}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-900/30 border border-red-500/30 text-xs font-bold text-red-400 animate-in fade-in slide-in-from-top-1">
                <Info size={16} />
                {errorMessage}
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-400 hover:shadow-indigo-500/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              type="submit"
            >
              {isSubmitting ? "Authenticating..." : <>Secure Login <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
