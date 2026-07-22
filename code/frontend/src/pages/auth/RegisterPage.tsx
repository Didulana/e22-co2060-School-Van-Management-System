import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { API_BASE_URL } from "../../config/api";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "parent" as "parent" | "driver",
  phone: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validateForm() {
    if (!form.name.trim() || form.name.length < 3) {
      return "Name must be at least 3 characters long.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address.";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!form.password || form.password.length < 6) {
      return "Password must be at least 6 characters long.";
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to register");
      }

      // Automatically login via context
      login({ token: data.token, user: data.user });
      
      const roleHome: Record<string, string> = {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/tracking",
      };
      navigate(roleHome[data.user.role] || "/login", { replace: true });

    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to register"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border-4 border-emerald-400 bg-white shadow-xl text-3xl font-extrabold text-emerald-600">
            K
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Create your KidsRoute account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{" "}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 underline underline-offset-4">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Account Type</label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="parent" 
                    checked={form.role === "parent"}
                    onChange={() => setForm({ ...form, role: "parent" })}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Parent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="driver" 
                    checked={form.role === "driver"}
                    onChange={() => setForm({ ...form, role: "driver" })}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Driver</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="name">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0771234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
