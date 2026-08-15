import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../redux/thunks/authThunks";
import { clearAuthError } from "../redux/slices/authSlice";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const redirectTo = location.state?.from || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMode = (newMode) => {
    dispatch(clearAuthError());
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    let action;
    if (mode === "login") {
      action = loginUser({ email: form.email, password: form.password });
    } else {
      action = registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      });
    }

    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold mb-2 text-center">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-center text-ink/50 mb-8 text-sm">
        {mode === "login"
          ? "Log in to continue shopping"
          : "Join Market & Co. in a few seconds"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4 shadow-sm"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {mode === "register" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-ink/10 pb-4 mb-4">
            <input
              required
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              name="phone"
              placeholder="Phone number (e.g. 9876543210)"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              name="street"
              placeholder="Street address"
              value={form.street}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              name="zip"
              placeholder="ZIP code"
              value={form.zip}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
        )}

        <input
          required
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink"
        />
        <input
          required
          type="password"
          name="password"
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper rounded-full py-3 hover:bg-plum transition-colors disabled:opacity-50 mt-4 font-medium"
        >
          {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button
          onClick={() => toggleMode(mode === "login" ? "register" : "login")}
          type="button"
          className="text-clay underline font-medium"
        >
          {mode === "login" ? "Create an account" : "Log in"}
        </button>
      </p>

      {mode === "login" && (
        <p className="text-center text-xs text-ink/30 mt-4">
          Demo admin: admin@shop.com / Admin@123 &nbsp;·&nbsp; Demo user: user@shop.com / User@123
        </p>
      )}
    </div>
  );
};

export default Login;