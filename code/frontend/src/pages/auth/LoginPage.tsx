import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchDemoAccounts, login } from "../../features/auth/api";
import { DemoAccount } from "../../features/auth/types";
import { useAuth } from "../../features/auth/AuthContext";
import { BusFront, ArrowRight, ShieldCheck, Mail, Lock, Info } from "lucide-react";

const emptyCredentials = {
  email: "",
  password: "",
};

const passwordHints: Record<string, string> = {
  driver: "Driver@123",
  parent: "Parent@123",
};

const roleDescriptions: Record<string, string> = {
  driver: "Manage student pickups and your daily route.",
  parent: "Check where the van is and get safety updates.",
};

function LoginPage() {
  const navigate = useNavigate();
  const { session, login: contextLogin, logout: contextLogout } = useAuth();

  const [credentials, setCredentials] = useState(emptyCredentials);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const accounts = await fetchDemoAccounts();
        if (!active) return;
        setDemoAccounts(accounts);
        const firstVisible = accounts.find(a => a.role !== "admin");
        setSelectedAccountEmail(firstVisible?.email ?? "");
      } catch {
        // Silently fail or log
      } finally {
        if (active) setIsBootstrapping(false);
      }
    }
    void bootstrap();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (session && !isBootstrapping) {
      const roleHome: Record<string, string> = {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/tracking",
      };
      navigate(roleHome[session.user.role] || "/login", { replace: true });
    }
  }, [session, isBootstrapping, navigate]);


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
      contextLogin(nextSession);
      const roleHome: Record<string, string> = {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/tracking",
      };
      navigate(roleHome[nextSession.user.role] || "/login", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDemoSelect(email: string) {
    setSelectedAccountEmail(email);
    const account = demoAccounts.find((item) => item.email === email);
    if (!account) return;
    setCredentials({
      email: account.email,
      password: passwordHints[account.role] ?? "",
    });
    setErrorMessage(null);
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfdfc]">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
            <BusFront className="text-white w-6 h-6" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Connecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfc] text-slate-900 grid lg:grid-cols-2 font-sans">
      {/* Left Panel: Hero */}
      <div className="hidden lg:flex flex-col justify-between p-16 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_25%)]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
            <BusFront className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl text-white tracking-tighter">KidsRoute</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black text-white leading-tight tracking-tighter max-w-[12ch]">
            Experience the <span className="text-emerald-300">future</span> of school transport.
          </h1>
          <p className="mt-6 text-xl text-emerald-50/70 max-w-md font-medium leading-relaxed">
            Real-time tracking, seamless logistics, and ultimate safety for the children who matter most. 
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                        U{i}
                    </div>
                ))}
            </div>
            <p className="text-sm font-bold text-emerald-50/60 uppercase tracking-widest">Trusted by 200+ local drivers</p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome Back</h2>
            <p className="mt-2 text-slate-500 font-medium">Log in to your account to continue.</p>
          </div>

          {!session ? (
            <form className="space-y-6" onSubmit={handleSubmit}>


              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                    onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Email or Username"
                    type="email"
                    value={credentials.email}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                    onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Password"
                    type="password"
                    value={credentials.password}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1">
                  <Info size={16} />
                  {errorMessage}
                </div>
              )}

              <button
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                type="submit"
              >
                {isSubmitting ? "Signing in..." : <>Access Dashboard <ArrowRight size={20} /></>}
              </button>

              <div className="pt-8 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  New to KidsRoute?{" "}
                  <Link to="/register" className="text-emerald-600 hover:text-emerald-500 underline underline-offset-8 decoration-2">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem]">
                    <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-2xl font-black text-emerald-600 border border-emerald-200">
                        {session.user.name?.charAt(0) || "P"}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure session active</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Hi, {session.user.name?.split(' ')[0]}</h3>
                    </div>
                </div>

                <div className="grid gap-3">
                    <button
                        onClick={() => navigate({admin: "/admin/dashboard", driver: "/driver", parent: "/tracking"}[session.user.role] || "/login")}
                        className="w-full bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                    >
                        Resume to Dashboard
                    </button>
                    <button
                        onClick={contextLogout}
                        className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        Switch Account
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
