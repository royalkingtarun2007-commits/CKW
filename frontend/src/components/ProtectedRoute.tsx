import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition">

      {/* TOP BAR */}
      <Navbar />

      <div className="flex">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <main className="relative flex-1 min-h-screen overflow-hidden">

          {/* BACKGROUND (Behind content only) */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="nebula-blob nebula-blob--1 opacity-40 dark:opacity-50" />
            <div className="nebula-blob nebula-blob--2 opacity-40 dark:opacity-60" />
            <div className="nebula-haze opacity-20 dark:opacity-30" />

            <div className="absolute inset-0">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="nebula-star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* CONTENT LAYER */}
          <section className="relative z-10 pt-20 px-8">
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                {children}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
