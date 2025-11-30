// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/User";
import toast from "react-hot-toast";
import { uploadAvatarApi } from "../api/auth";

/**
 * Profile page — Large Cosmic Glass Card + Circle Avatar Upload (hover)
 * - Clean hover upload UI
 * - Uses upload endpoint: POST /api/auth/upload-avatar
 * - Expects auth token from useAuth()
 */

const SkillPill: React.FC<{ children: string }> = ({ children }) => (
  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-white/10 border border-white/10 mr-2 mb-2">
    {children}
  </span>
);

const ProjectCard: React.FC<{ p: any }> = ({ p }) => (
  <div className="bg-white/5 dark:bg-gray-800/60 border border-white/5 rounded-2xl p-4 shadow-sm transform transition hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{p.title}</h3>
      {p.link ? (
        <a className="text-xs opacity-80" href={p.link} target="_blank" rel="noreferrer">
          Visit
        </a>
      ) : null}
    </div>
    <p className="mt-2 text-sm opacity-80">{p.description}</p>
  </div>
);

// Local test placeholder you uploaded — this path is included for testing only.
// The dev environment (deploy) should serve real uploads from backend /uploads
const placeholderUrl = "/avatar.png";


const Profile: React.FC = () => {
  const { user, loading, updateUser, token } = useAuth();

  const [local, setLocal] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  // Resolve backend-provided avatar path to an absolute URL in dev
  function resolveAvatarUrl(avatarPath: string) {
    if (!avatarPath) return undefined;
    if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) return avatarPath;
    const base = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";
    return avatarPath.startsWith("/") ? `${base}${avatarPath}` : `${base}/${avatarPath}`;
  }

  useEffect(() => {
    if (user) {
      const u = { ...user } as any;
      if (!u.id && u._id) u.id = u._id;
      setLocal(u);
      setAvatarPreview(u.avatar ? resolveAvatarUrl(u.avatar) : placeholderUrl);
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user || !local) return <p className="text-center mt-10">No user data.</p>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        name: local.name,
        email: local.email,
        bio: local.bio ?? "",
        avatar: local.avatar ?? "",
        skills: local.skills ?? [],
        social: local.social ?? {},
        achievements: local.achievements ?? [],
        projects: local.projects ?? [],
        level: local.level ?? 1,
        xp: local.xp ?? 0,
      };

      await updateUser(payload);
      toast.success("Profile updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarFile = async (file?: File) => {
    if (!file) return;
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    // show immediate preview
    const tmp = URL.createObjectURL(file);
    setAvatarPreview(tmp);

    try {
      setUploading(true);
      const res = await uploadAvatarApi(token, file);
      console.log("UPLOAD RESPONSE:", res.data);

      // res.data expected: { message, user, avatar } OR { user, avatar }
      const updatedUser = res.data.user ?? res.data;
      const avatarPath = res.data.avatar ?? updatedUser.avatar;

// ✅ Save avatar permanently in DB
await updateUser({ avatar: avatarPath });

// ✅ Update local state
setLocal(prev => (prev ? { ...prev, avatar: avatarPath } : prev));

// ✅ Show final image (not the temp blob)
setAvatarPreview(resolveAvatarUrl(avatarPath));

toast.success("Avatar uploaded");

    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  // UI helpers (skills, achievements, projects)
  const addSkill = (s: string) => {
    if (!s) return;
    setLocal(prev => {
      if (!prev) return prev;
      const existing = new Set(prev.skills || []);
      existing.add(s);
      return { ...prev, skills: Array.from(existing) };
    });
  };
  const removeSkill = (s: string) =>
    setLocal(prev => (prev ? { ...prev, skills: (prev.skills || []).filter(x => x !== s) } : prev));
  const addAchievement = (a: string) =>
    setLocal(prev => (prev ? { ...prev, achievements: [...(prev.achievements || []), a] } : prev));
  const addProject = (p: { title: string; description?: string; link?: string }) =>
    setLocal(prev => (prev ? { ...prev, projects: [...(prev.projects || []), p] } : prev));

  return (
    <div className="min-h-[80vh] px-4 py-8">
      <div className="nebula-haze pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
        {/* Header card */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/5 rounded-2xl p-6 sticky top-8">
            <div className="flex items-center space-x-4">
              {/* Avatar block with clean hover upload */}
              <div className="relative group">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 bg-gray-200 dark:bg-gray-700"
                  aria-hidden
                >
                  {avatarPreview ? (
                    <img
  src={avatarPreview}
  alt="avatar"
  className="w-full h-full object-cover"
  onError={() => setAvatarPreview(placeholderUrl)}
/>

                  ) : local.avatar ? (
                    <img src={resolveAvatarUrl(local.avatar)} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {local.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>

                {/* hover overlay - clean upload */}
                <label
                  className="absolute inset-0 flex items-end justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Upload avatar"
                >
                  <div className="bg-black/50 dark:bg-white/10 rounded-full p-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleAvatarFile(f);
                      }}
                      aria-label="Upload avatar"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m0 0h8"
                      />
                    </svg>
                  </div>
                </label>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold truncate">{local.name}</h1>
                <p className="text-sm opacity-80 mt-1 truncate">
                  {local.bio || "Cosmic explorer and full-stack dev"}
                </p>

                <div className="mt-3 flex items-center space-x-2">
                  <div className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/5">
                    Level {local.level ?? 1}
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/5">
                    {(local.projects || []).length} Projects
                  </div>
                </div>
              </div>
            </div>

            {/* Social inputs */}
            <div className="mt-4">
              <label className="block text-sm opacity-80 mb-1">Social</label>
              <input
                value={local.social?.github ?? ""}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    social: { ...(local.social || {}), github: e.target.value },
                  })
                }
                placeholder="Github username or url"
                className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 text-sm mb-2"
              />
              <input
                value={local.social?.linkedin ?? ""}
                onChange={(e) =>
                  setLocal({
                    ...local,
                    social: { ...(local.social || {}), linkedin: e.target.value },
                  })
                }
                placeholder="LinkedIn url"
                className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* XP bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span>XP</span>
                <span>
                  {local.xp ?? 0} / {(local.level ?? 1) * 100}
                </span>
              </div>
              <div className="w-full bg-white/6 h-3 rounded-full">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (((local.xp ?? 0) / ((local.level ?? 1) * 100)) * 100 || 0)
                    )}%`,
                    background:
                      "linear-gradient(90deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))",
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg active:scale-95 transition"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Main content (keeps your existing layout) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity card */}
          <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm opacity-80 mb-1">Full Name</label>
                <input
                  value={local.name}
                  onChange={(e) => setLocal({ ...local, name: e.target.value })}
                  className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm opacity-80 mb-1">Email</label>
                <input
                  value={local.email}
                  onChange={(e) => setLocal({ ...local, email: e.target.value })}
                  className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm opacity-80 mb-1">Bio</label>
                <textarea
                  value={local.bio ?? ""}
                  onChange={(e) => setLocal({ ...local, bio: e.target.value })}
                  className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 h-28 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills & achievements */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">Skills</h2>

              <div className="mb-4">
                <div className="flex flex-wrap">
                  {(local.skills || []).map((s) => (
                    <div key={s} className="flex items-center mr-2 mb-2">
                      <SkillPill>{s}</SkillPill>
                      <button
                        onClick={() => removeSkill(s)}
                        className="text-xs ml-1 opacity-70 hover:opacity-100"
                        aria-label={`remove ${s}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <SkillAdder onAdd={addSkill} />
              </div>

              <h3 className="text-sm font-medium mb-2">Featured Projects</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(local.projects || []).map((p, idx) => (
                  <ProjectCard key={idx} p={p} />
                ))}
                <NewProjectForm onAdd={addProject} />
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">Achievements</h2>
              <div className="space-y-2">
                {(local.achievements || []).map((a, idx) => (
                  <div
                    key={idx}
                    className="text-sm bg-white/3 rounded-md px-3 py-2 flex justify-between items-center"
                  >
                    <span>{a}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <AchievementAdder onAdd={addAchievement} />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="backdrop-blur-md bg-white/5 dark:bg-gray-900/40 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Highlights</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-white/5">
                <div className="text-sm">Projects</div>
                <div className="mt-2 text-2xl font-bold">{(local.projects || []).length}</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-red-400/10 border border-white/5">
                <div className="text-sm">Achievements</div>
                <div className="mt-2 text-2xl font-bold">{(local.achievements || []).length}</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400/10 to-cyan-400/10 border border-white/5">
                <div className="text-sm">Skills</div>
                <div className="mt-2 text-2xl font-bold">{(local.skills || []).length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helper components */

const SkillAdder: React.FC<{ onAdd: (s: string) => void }> = ({ onAdd }) => {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 text-sm"
        placeholder="Add skill (e.g. React)"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(val.trim());
            setVal("");
          }
        }}
      />
      <button
        onClick={() => {
          onAdd(val.trim());
          setVal("");
        }}
        className="px-3 py-2 bg-white/6 rounded-lg text-sm"
      >
        Add
      </button>
    </div>
  );
};

const AchievementAdder: React.FC<{ onAdd: (a: string) => void }> = ({ onAdd }) => {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 text-sm"
        placeholder="Add achievement (e.g. 'Completed X')"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(val.trim());
            setVal("");
          }
        }}
      />
      <button
        onClick={() => {
          onAdd(val.trim());
          setVal("");
        }}
        className="px-3 py-2 bg-white/6 rounded-lg text-sm"
      >
        Add
      </button>
    </div>
  );
};

const NewProjectForm: React.FC<{
  onAdd: (p: { title: string; description?: string; link?: string }) => void;
}> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  return (
    <div className="p-4 border border-white/5 rounded-2xl">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
        className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 mb-2 text-sm"
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Project link (optional)"
        className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 mb-2 text-sm"
      />
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Short description"
        className="w-full bg-transparent border border-white/6 rounded-lg px-3 py-2 text-sm mb-2 resize-none"
      />
      <div className="flex justify-end">
        <button
          onClick={() => {
            onAdd({ title: title.trim(), description: desc.trim(), link: link.trim() });
            setTitle("");
            setDesc("");
            setLink("");
          }}
          className="px-3 py-2 bg-white/6 rounded-lg text-sm"
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default Profile;
