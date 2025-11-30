import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-[80vh] px-4 py-10 animate-fadeIn">

      {/* Subtle cosmic background */}
      <div className="nebula-blob nebula-blob--1 pointer-events-none" />
      <div className="nebula-blob nebula-blob--2 pointer-events-none" />
      <div className="nebula-haze pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8">
        
       {/* HEADER SECTION */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-2xl rounded-2xl p-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
      </div>


        {/* WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70">Account Created</p>
            <h2 className="text-2xl font-bold mt-1">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </h2>
          </div>

          <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70">Email</p>
            <h2 className="text-xl font-semibold mt-1">{user?.email}</h2>
          </div>

          <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70">Level</p>
            <h2 className="text-3xl font-bold mt-1">{user?.level ?? 1}</h2>
          </div>
        </div>

        {/* XP Progress */}
        <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/10 rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">XP Progress</h2>

          <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (((user?.xp ?? 0) / ((user?.level ?? 1) * 100)) * 100)
                )}%`,
                background:
                  "linear-gradient(90deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))",
              }}
            />
          </div>

          <p className="text-sm opacity-70 mt-2">
            {user?.xp ?? 0} XP / {(user?.level ?? 1) * 100}
          </p>
        </div>

        {/* PROJECTS SECTION */}
        <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/10 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Your Projects</h2>

          {user?.projects && user.projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {user.projects.map((p, i) => (
                <div
                  key={i}
                  className="p-5 bg-white/5 border border-white/10 rounded-xl hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="opacity-80 text-sm mt-2">{p.description}</p>

                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      className="text-sm mt-3 inline-block text-indigo-400 hover:underline"
                    >
                      Visit project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-70">You haven't added any projects yet.</p>
          )}
        </div>

        {/* ACTIVITY LOG */}
        <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/10 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

          <ul className="space-y-4">
            <li className="border-l-2 border-indigo-400 pl-4">
              <p className="font-semibold">Logged in</p>
              <span className="text-sm opacity-60">Just now</span>
            </li>

            <li className="border-l-2 border-purple-400 pl-4">
              <p className="font-semibold">Viewed Dashboard</p>
              <span className="text-sm opacity-60">A few seconds ago</span>
            </li>

            <li className="border-l-2 border-blue-400 pl-4">
              <p className="font-semibold">Updated profile</p>
              <span className="text-sm opacity-60">Today</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
