import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden transition bg-gray-100 dark:bg-gray-900 dark:text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="nebula-blob nebula-blob--1 opacity-40 dark:opacity-50"></div>
        <div className="nebula-blob nebula-blob--2 opacity-40 dark:opacity-60"></div>
        <div className="nebula-haze opacity-20 dark:opacity-30"></div>

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

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar />
      </div>

      {/* Page content */}
      <div className="relative z-20 pt-24 pl-72 pr-6 animate-fadeIn">
        {children}
      </div>

    </div>
  );
};

export default ProtectedLayout;
