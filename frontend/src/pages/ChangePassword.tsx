import { useState } from "react";
import { changePassword as apiChangePassword } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

const ChangePassword = () => {
  const { token } = useAuth();

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      setSaving(true);

      await apiChangePassword(token, { oldPassword, newPassword });

      setMessage("Password updated successfully!");
      setOld("");
      setNew("");
      setConfirm("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] px-4 py-10 animate-fadeIn">

      {/* Subtle cosmic background */}
      <div className="nebula-haze pointer-events-none absolute inset-0 opacity-40"></div>

      <div className="max-w-xl mx-auto relative z-20">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 shadow-xl rounded-2xl p-8">

          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Change Password
          </h1>

          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOld(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 
                           border border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNew(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 
                           border border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="New password"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 
                           border border-gray-300 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Re-enter new password"
              />
            </div>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {message && (
              <p className="text-green-500 text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                         hover:brightness-110 active:scale-95 shadow-md"
            >
              {saving ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
