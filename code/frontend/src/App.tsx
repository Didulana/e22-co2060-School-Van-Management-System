import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import {
  fetchCurrentUser,
  fetchDemoAccounts,
  login,
} from "./features/auth/api";
import {
  clearStoredSession,
  readStoredSession,
  storeSession,
} from "./features/auth/storage";
import { AuthSession, DemoAccount } from "./features/auth/types";

const emptyCredentials = {
  email: "",
  password: "",
};

function App() {
  const [credentials, setCredentials] = useState(emptyCredentials);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const [accounts, storedSession] = await Promise.all([
          fetchDemoAccounts(),
          Promise.resolve(readStoredSession()),
        ]);

        if (!active) {
          return;
        }

        setDemoAccounts(accounts);

        if (!storedSession) {
          setIsBootstrapping(false);
          return;
        }

        const currentUser = await fetchCurrentUser(storedSession.token);

        if (!active) {
          return;
        }

        const refreshedSession = {
          token: storedSession.token,
          user: currentUser,
        };

        setSession(refreshedSession);
        storeSession(refreshedSession);
      } catch {
        clearStoredSession();

        if (active) {
          setSession(null);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const nextSession = await login(credentials.email, credentials.password);
      setSession(nextSession);
      storeSession(nextSession);
      setCredentials(emptyCredentials);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoAccount(account: DemoAccount) {
    setCredentials({
      email: account.email,
      password: account.passwordHint,
    });
    setErrorMessage(null);
  }

  function handleLogout() {
    clearStoredSession();
    setSession(null);
    setCredentials(emptyCredentials);
  }

  if (isBootstrapping) {
    return (
      <main className="app-shell">
        <section className="panel panel--center">
          <p className="eyebrow">School Van Management System</p>
          <h1>Checking saved session...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Member A Workspace</p>
        <h1>Authentication foundation for the PERN school transport system.</h1>
        <p className="hero-copy">
          This starter gives the team a real JWT login flow, role-aware access,
          and demo credentials for local integration until the permanent user
          database is finalized.
        </p>
        <div className="badge-row">
          <span>TypeScript</span>
          <span>JWT</span>
          <span>Role-based access</span>
          <span>React + Vite</span>
        </div>
      </section>

      {session ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Authenticated Session</p>
              <h2>{session.user.name || session.user.email}</h2>
            </div>
            <button className="ghost-button" onClick={handleLogout} type="button">
              Log out
            </button>
          </div>

          <div className="session-grid">
            <article>
              <span>Role</span>
              <strong>{session.user.role}</strong>
            </article>
            <article>
              <span>User ID</span>
              <strong>{session.user.id}</strong>
            </article>
            <article>
              <span>Email</span>
              <strong>{session.user.email}</strong>
            </article>
          </div>

          <div className="token-card">
            <p className="eyebrow">Bearer Token</p>
            <code>{session.token}</code>
          </div>
        </section>
      ) : (
        <section className="panel auth-layout">
          <div>
            <p className="eyebrow">Sign In</p>
            <h2>Use a seeded account to start integration testing.</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  autoComplete="email"
                  onChange={(event) =>
                    setCredentials((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="driver1@schoolvan.local"
                  type="email"
                  value={credentials.email}
                />
              </label>

              <label>
                Password
                <input
                  autoComplete="current-password"
                  onChange={(event) =>
                    setCredentials((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Driver@123"
                  type="password"
                  value={credentials.password}
                />
              </label>

              {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <div>
            <p className="eyebrow">Demo Accounts</p>
            <div className="demo-grid">
              {demoAccounts.map((account) => (
                <button
                  className="demo-card"
                  key={account.email}
                  onClick={() => fillDemoAccount(account)}
                  type="button"
                >
                  <span>{account.role}</span>
                  <strong>{account.email}</strong>
                  <small>Password: {account.passwordHint}</small>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
