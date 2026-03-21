import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDemoAccounts, login } from "../../features/auth/api";
import { DemoAccount } from "../../features/auth/types";
import { useAuth } from "../../features/auth/AuthContext";

const emptyCredentials = {
  email: "",
  password: "",
};

const passwordHints: Record<string, string> = {
  admin: "Admin@123",
  driver: "Driver@123",
  parent: "Parent@123",
};

const roleDescriptions: Record<string, string> = {
  admin: "You have full access to manage drivers, vehicles, routes, and system settings.",
  driver: "You can view your assigned routes, update journey status, and manage boarding events.",
  parent: "You can track your children's van in real-time and receive journey notifications.",
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
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const accounts = await fetchDemoAccounts();

        if (!active) return;
        setDemoAccounts(accounts);
        setSelectedAccountEmail(accounts[0]?.email ?? "");
      } catch {
        if (active) {
          setBootstrapError(
            "Frontend loaded, but the initial auth bootstrap failed. Check that the backend is running on http://localhost:5001."
          );
        }
      } finally {
        if (active) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const selectedAccount = useMemo(
    () => demoAccounts.find((account) => account.email === selectedAccountEmail) ?? null,
    [demoAccounts, selectedAccountEmail]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const nextSession = await login(credentials.email, credentials.password);
      contextLogin(nextSession);
      setCredentials(emptyCredentials);
      
      const roleHome: Record<string, string> = {
        admin: "/admin",
        driver: "/driver",
        parent: "/tracking",
      };
      navigate(roleHome[nextSession.user.role] || "/login", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in"
      );
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
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Frontend loaded successfully on Vite. Backend target:
            {" "}
            <strong>http://localhost:5001/api</strong>
          </div>

          <div className="flex h-72 items-center justify-center rounded-[3rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
              <p className="text-sm font-medium text-slate-500">Preparing sign in portal...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Frontend loaded successfully on Vite. Backend target:
          {" "}
          <strong>http://localhost:5001/api</strong>
        </div>

        <section className="relative overflow-hidden rounded-[3rem] bg-[#c7d8d2] shadow-[0_35px_90px_rgba(15,23,42,0.12)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(77,108,102,0.28),rgba(77,108,102,0.35))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_20%),linear-gradient(115deg,rgba(109,141,134,0.55),rgba(165,191,183,0.25))]" />
          <div className="absolute left-10 top-20 hidden h-72 w-72 rounded-full border border-white/15 bg-white/10 blur-3xl lg:block" />
          <div className="absolute bottom-[-4rem] left-1/4 hidden h-40 w-[28rem] rounded-full bg-emerald-200/30 blur-3xl lg:block" />

          <div className="relative z-10 px-6 py-8 md:px-10 lg:px-12 lg:py-10">
            <div className="flex flex-col gap-6 lg:min-h-[38rem]">
              <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-400/80 bg-white/70 text-lg font-bold text-emerald-600">
                    S
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-white">SchoolVan</div>
                    <div className="text-sm text-white/75">Transport management platform</div>
                  </div>
                </div>

                <nav className="flex flex-wrap items-center gap-6 text-lg text-white/90">
                  <a className="transition hover:text-white" href="#home">Home</a>
                  <a className="transition hover:text-white" href="#why-us">Why us</a>
                  <a className="transition hover:text-white" href="#how-it-works">How it works</a>
                  <a className="transition hover:text-white" href="#contact">Contact</a>
                </nav>
              </header>

              <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.72fr)] lg:items-center">
                <div className="max-w-3xl py-4 lg:py-10">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                    School transport portal
                  </p>
                  <h1 id="home" className="max-w-[12ch] text-5xl font-light leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Your school transport <span className="font-extrabold">management system</span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-xl leading-9 text-white/90">
                    One place to manage school vans, routes, parent communication, and real-time journey visibility.
                  </p>
                </div>

                <aside className="rounded-[2rem] bg-white/95 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
                  {session ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm text-slate-500">Active session</p>
                        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                          Welcome back
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-sm text-slate-400">Name</div>
                          <div className="mt-1 text-base font-semibold text-slate-900">
                            {session.user.name || session.user.email}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-sm text-slate-400">Role</div>
                          <div className="mt-1 text-base font-semibold capitalize text-slate-900">
                            {session.user.role}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {roleDescriptions[session.user.role]}
                      </div>

                      <button
                        className="w-full rounded-2xl bg-emerald-500 px-4 py-4 text-xl font-semibold text-white transition hover:bg-emerald-600"
                        onClick={() => {
                          const roleHome: Record<string, string> = {
                            admin: "/admin",
                            driver: "/driver",
                            parent: "/tracking",
                          };
                          navigate(roleHome[session.user.role] || "/login");
                        }}
                        type="button"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        className="w-full rounded-2xl bg-slate-200 px-4 py-4 text-xl font-semibold text-slate-700 transition hover:bg-slate-300"
                        onClick={contextLogout}
                        type="button"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div>
                        <label className="mb-3 block text-2xl font-medium tracking-tight text-slate-800" htmlFor="user-select">
                          Select user
                        </label>
                        <select
                          className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-5 text-xl text-slate-500 shadow-[0_8px_24px_rgba(16,185,129,0.08)] outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                          id="user-select"
                          onChange={(event) => handleDemoSelect(event.target.value)}
                          value={selectedAccountEmail}
                        >
                          {demoAccounts.map((account) => (
                            <option key={account.email} value={account.email}>
                              {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          autoComplete="email"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-5 text-xl text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                          onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                          placeholder="Username"
                          type="email"
                          value={credentials.email}
                        />
                      </div>

                      <div>
                        <input
                          autoComplete="current-password"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-5 text-xl text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                          onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                          placeholder="Password"
                          type="password"
                          value={credentials.password}
                        />
                      </div>

                      {errorMessage && (
                        <div className="rounded-2xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        className="w-full rounded-2xl bg-emerald-500 px-4 py-4 text-2xl font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-wait disabled:opacity-70"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? "Signing in..." : "Log in"}
                      </button>

                      {bootstrapError && (
                        <div className="text-center text-xs text-red-500 mt-2">{bootstrapError}</div>
                      )}
                    </form>
                  )}
                </aside>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
