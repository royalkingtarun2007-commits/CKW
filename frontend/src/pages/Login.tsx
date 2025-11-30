import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const COMET_INTERVAL_MS = 1400;

const cometModes = [
  { r: 255, g: 200, b: 200 },
  { r: 120, g: 180, b: 255 },
  { r: 255, g: 150, b: 90 },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const starsRef = useRef<HTMLDivElement | null>(null);
  const cometContainerRef = useRef<HTMLDivElement | null>(null);
  const cometTimerRef = useRef<number | null>(null);
  const warpRef = useRef<HTMLDivElement | null>(null);


  /* 🌠 Cinematic comets */
  useEffect(() => {
    const container = cometContainerRef.current;
    if (!container) return;

    const spawn = () => {
      const c = document.createElement("div");
      c.className = "comet";

      const pick = cometModes[Math.floor(Math.random() * cometModes.length)];
      c.style.setProperty("--r", `${pick.r}`);
      c.style.setProperty("--g", `${pick.g}`);
      c.style.setProperty("--b", `${pick.b}`);

      c.style.setProperty("--size", `${(Math.random() * 3 + 2).toFixed(1)}px`);
      const angle = (Math.random() * 15 + 60).toFixed(1) + "deg";
      c.style.setProperty("--angle", angle);

      c.style.setProperty("--dx", `${Math.random() * 100 + 80}vw`);
      c.style.setProperty("--dy", `${Math.random() * 160 + 120}vh`);

      c.style.left = `${Math.random() * 100}%`;
      c.style.top = `${Math.random() * 12 - 6}%`;

      c.style.setProperty("--duration", `${(Math.random() * 2 + 2).toFixed(1)}s`);

      container.appendChild(c);

      setTimeout(() => c.remove(), 5000);
      cometTimerRef.current = window.setTimeout(spawn, COMET_INTERVAL_MS);
    };

    cometTimerRef.current = window.setTimeout(spawn, 700);
  }, []);

  const triggerWarp = () => {
    const node = warpRef.current;
    if (!node) return;
    node.classList.remove("warp-active");
    node.offsetWidth;
    node.classList.add("warp-active");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    triggerWarp();

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎥 REAL NASA VIDEO BACKGROUND */}
<video
  className="absolute inset-0 w-full h-full object-cover z-0"
  autoPlay
  loop
  muted
  playsInline
  src="/videos/milkyway.mp4"
/>

{/* Dynamic blending layer */}
<div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/30 via-black/40 to-black/70 backdrop-blur-[2px]"></div>


      {/* Stars + comets */}
      <div ref={starsRef} className="absolute inset-0 z-10 pointer-events-none"></div>
      <div ref={cometContainerRef} className="absolute inset-0 z-20 pointer-events-none"></div>

      {/* LOGIN CARD */}
      <div className="
      relative z-30 w-full max-w-md p-8 rounded-3xl 
     bg-black/40 backdrop-blur-xl 
     border border-white/20 
     shadow-[0_0_35px_rgba(0,0,0,0.6)]
     animate-cardIn
      ">
        <h1 className="text-center text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-red-400 to-amber-300 animate-glow">
          Welcome Back
        </h1>

        <p className="text-center text-sm text-red-100/70 mb-6">
          Access the <span className="font-semibold">CKW</span> command deck
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-red-100/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-red-50 outline-none focus:ring-2 focus:ring-red-400"
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
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-red-50 outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Your password"
            />
          </div>

          {error && <div className="text-center text-sm text-rose-300 animate-shake">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-red-600 to-rose-500 text-white hover:brightness-110 shadow-lg active:scale-[0.98]"
          >
            {loading ? "Warping..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-red-100/60">
          Don't have an account?
          <Link to="/register" className="text-rose-300 underline ml-1">Create one</Link>
        </p>
      </div>

      <div ref={warpRef} className="warp-overlay z-40 pointer-events-none"></div>
    </div>
  );
};

export default Login;
