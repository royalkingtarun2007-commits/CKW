import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const burstRef = useRef<HTMLDivElement | null>(null);

  const triggerBurst = () => {
    const burst = burstRef.current;
    if (!burst) return;
    burst.classList.remove("burst-active");
    burst.offsetWidth; 
    burst.classList.add("burst-active");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    triggerBurst();

    try {
      await registerUser(name, email, password);
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎥 GALAXY BACKGROUND VIDEO */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        src="/videos/blackhole.mp4"
      ></video>

      {/* Cinematic blending layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70 z-0 pointer-events-none"></div>

      {/* Soft cosmic fog for blending */}
      <div className="absolute inset-0 pointer-events-none z-0 
        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]
        mix-blend-screen opacity-60 blur-[40px]">
      </div>

      {/* CARD */}
      <div className="relative z-30 w-full max-w-md p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_0_35px_rgba(0,0,0,0.7)] animate-registerCard">
        
        <h1 className="text-center text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-red-400 to-rose-400 animate-titleGlow">
          Create Account
        </h1>

        <p className="text-center text-sm text-red-100/70 mb-6">
          Join the cosmic <span className="font-semibold">CKW Network</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 text-sm text-red-100/80">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-red-50 placeholder-red-200/50 focus:ring-2 focus:ring-rose-300 outline-none reg-hover"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-red-100/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-red-50 placeholder-red-200/50 focus:ring-2 focus:ring-rose-300 outline-none reg-hover"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-red-100/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-red-50 placeholder-red-200/50 focus:ring-2 focus:ring-rose-300 outline-none reg-hover"
              placeholder="Choose a strong password"
            />
          </div>

          {error && (
            <div className="text-center text-sm text-rose-300 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 hover:brightness-110 active:scale-[0.98] shadow-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-red-100/60">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-300 underline">
            Go to Login
          </Link>
        </p>
      </div>

      {/* REGISTER BURST */}
      <div ref={burstRef} className="register-burst z-40 pointer-events-none"></div>

      {/* Cinematic Fade */}
      <div className="absolute inset-0 z-50 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none"></div>
    </div>
  );
};

export default Register;
