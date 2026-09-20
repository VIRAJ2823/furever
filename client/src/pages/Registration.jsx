import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import googleLogo from "../assets/google.png";
import paws from "../assets/paws.png";
import { authDataContext } from "../context/Authcontext.jsx";
import { userDataContext } from "../context/UserContext.jsx";
import { auth, provider } from "../utils/Firebase.js";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Registration() {
  const { serverUrl } = useContext(authDataContext) || {};
  const { getCurrentUser } = useContext(userDataContext) || {};
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
      if (typeof getCurrentUser === "function") {
        await getCurrentUser();
      }
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
      setServerError("Google Sign-In requires Firebase configuration. Please use email & password.");
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

      if (typeof getCurrentUser === "function") {
        await getCurrentUser();
      }
      setStatus("success");
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Google Signup Error:", error);
      setServerError(error?.response?.data?.message || "Google registration failed.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#2B2730] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#DC8E90]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#58545F]/10 blur-3xl pointer-events-none" />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#EDE4DD] shadow-xl p-8 sm:p-10 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#58545F] flex items-center justify-center p-2 shadow-xs">
              <img src={paws} alt="Furever" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-black text-2xl uppercase tracking-tight text-[#2B2730]">
              FUR<span className="text-[#DC8E90]">EVER</span>
            </span>
          </Link>
          <h1 className="font-display font-black text-2xl uppercase tracking-tight text-[#2B2730]">
            Join Furever Streetwear 🐾
          </h1>
          <p className="text-xs text-[#58545F] mt-1 font-medium">
            Create an account to unlock 15% off Drop 001 and save your custom pet artwork proofs.
          </p>
        </div>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-3.5 px-4 rounded-full border border-[#EDE4DD] bg-[#FAF6F2] hover:bg-[#F5EFEB] text-[#2B2730] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs mb-6"
        >
          <img src={googleLogo} alt="Google" className="w-4 h-4 object-contain" />
          <span>Sign up with Google</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#EDE4DD] w-full" />
          <span className="bg-white px-3 text-[10px] font-black uppercase tracking-wider text-[#7E7785] shrink-0">
            Or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Your Name</label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-4 text-[#7E7785]" />
              <input
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                placeholder="Alex Mercer"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-4 text-[#7E7785]" />
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="creator@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#58545F] block mb-1">Password (min 6 characters)</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-[#7E7785]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EDE4DD] text-xs font-bold text-[#2B2730] placeholder-[#7E7785] focus:outline-none focus:border-[#58545F]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#7E7785] hover:text-[#2B2730] cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-full bg-[#58545F] hover:bg-[#2B2730] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{status === "loading" ? "Creating Account..." : "Create Streetwear Account 🐾"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#58545F] font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#DC8E90] font-black uppercase tracking-wider hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}