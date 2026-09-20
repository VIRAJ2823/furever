import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Flame } from "lucide-react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import googleLogo from "../assets/google.png";
import paws from "../assets/paws.png";
import { authDataContext } from "../context/Authcontext.jsx";
import { userDataContext } from "../context/UserContext.jsx";
import { auth, provider } from "../utils/Firebase.js";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Registration() {
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const valid = {
    name: form.name.trim().length >= 2,
    email: isValidEmail(form.email),
    password: form.password.length >= 6,
  };
  const allValid = valid.name && valid.email && valid.password;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!allValid) return;

    setServerError("");
    setStatus("loading");

    try {
      await axios.post(
        `${serverUrl}/api/auth/registeration`,
        { name: form.name, email: form.email, password: form.password },
        { withCredentials: true }
      );
      await getCurrentUser();
      setStatus("success");
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Registration Error:", error);
      setServerError(
        error?.response?.data?.message || "Registration failed. Please try again."
      );
      setStatus("idle");
    }
  };

  const handleGoogleSignup = async () => {
    if (!auth || !provider) {
      setServerError("Google Sign-In requires VITE_FIREBASE_API_KEY in client/.env. Please use email & password.");
      return;
    }
    try {
      setServerError("");
      setStatus("loading");
      const response = await signInWithPopup(auth, provider);
      const name = response.user.displayName;
      const email = response.user.email;

      await axios.post(
        `${serverUrl}/api/auth/google-login`,
        { name, email },
        { withCredentials: true }
      );
      await getCurrentUser();
      setStatus("success");
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setServerError(error?.response?.data?.message || error.message || "Google Sign In Failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0D11] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#FF462D]/12 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#FF462D]/08 blur-[100px] pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 sm:px-12 py-6 z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
            <img src={paws} alt="FurEver" className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-black text-xl tracking-tight uppercase">
            FUR<span className="text-[#FF462D]">EVER</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          Sign In Instead <span className="text-[#FF462D]">→</span>
        </Link>
      </div>

      {/* Center Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#14141A] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative"
        >
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#FF462D] mb-3">
              <Flame size={12} fill="currentColor" />
              Join The Pack
            </span>
            <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-white mb-2">
              CREATE ACCOUNT
            </h1>
            <p className="text-xs text-neutral-400">
              Get VIP early drop access and seamless order tracking.
            </p>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={status === "loading"}
            className="w-full py-3.5 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 mb-6"
          >
            <img src={googleLogo} alt="Google" className="w-4 h-4 object-contain" />
            <span>Sign Up with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#14141A] px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Or With Email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs outline-none focus:border-[#FF462D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs outline-none focus:border-[#FF462D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password (min. 6 chars)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs outline-none focus:border-[#FF462D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {serverError && (
              <p className="text-xs text-red-400 font-semibold text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-full bg-[#FF462D] hover:bg-[#E03B24] active:scale-[0.99] text-white font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#FF462D]/20 cursor-pointer disabled:opacity-50 mt-6"
            >
              {status === "loading" ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF462D] font-bold uppercase hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="py-6 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} FurEver Studio. Purpose-driven apparel.
      </div>
    </div>
  );
}