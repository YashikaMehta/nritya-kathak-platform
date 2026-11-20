import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { BookmarkItem, CommunitySubmission, StudentProfile } from "../types";

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    apiClient.get("/profile/me").then((res) => setProfile(res.data)).catch(() => {});
    apiClient.get("/bookmarks").then((res) => setBookmarks(res.data)).catch(() => {});
    apiClient.get("/community/my-submissions").then((res) => setSubmissions(res.data)).catch(() => {});
  }, [user]);

  if (loading) return <div className="p-12 text-center text-sm text-stone-500">Loading dashboard...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const res = await apiClient.put("/profile/me", profile);
    setProfile(res.data);
    setSavedMsg("Profile updated.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleRemoveBookmark = async (id: number) => {
    await apiClient.delete(`/bookmarks/${id}`);
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Practitioner Workspace</span>
          <h1 className="font-display text-4xl font-bold text-stone-900">Welcome, {user.full_name}</h1>
        </div>
        <Link to="/contribute" className="px-4 py-2 rounded-lg bg-crimson-700 text-white text-sm font-semibold">+ New Contribution</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 archival-card p-6">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">Practitioner & Student Profile</h2>
          {savedMsg && <div className="mb-3 p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs font-medium">{savedMsg}</div>}
          {profile && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Display Name</label>
                  <input type="text" value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Location</label>
                  <input type="text" value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Gharana Study Focus</label>
                  <input type="text" value={profile.gharana_affiliation || ""} onChange={(e) => setProfile({ ...profile, gharana_affiliation: e.target.value })} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Experience Level</label>
                  <input type="text" value={profile.experience_level || ""} onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Bio & Practice Notes</label>
                <textarea rows={3} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
              </div>
              <label className="flex items-center gap-2 text-xs text-stone-700">
                <input type="checkbox" checked={profile.is_public} onChange={(e) => setProfile({ ...profile, is_public: e.target.checked })} />
                Display my profile in the public Community Directory
              </label>
              <button type="submit" className="px-5 py-2 rounded-lg bg-crimson-700 text-white text-sm font-semibold">Save Profile</button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="archival-card p-6">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">Saved Study Bookmarks ({bookmarks.length})</h2>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-stone-500">Bookmark articles, gharanas, compositions, or gurus while exploring.</p>
            ) : (
              <ul className="space-y-2.5">
                {bookmarks.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-2 text-sm border-b border-stone-100 pb-2">
                    <Link to={b.entity_url} className="text-crimson-700 font-medium hover:underline truncate">{b.entity_title}</Link>
                    <button onClick={() => handleRemoveBookmark(b.id)} className="text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="archival-card p-6">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">My Submissions ({submissions.length})</h2>
            {submissions.length === 0 ? (
              <p className="text-xs text-stone-500">No archival submissions yet.</p>
            ) : (
              <ul className="space-y-3">
                {submissions.map((s) => (
                  <li key={s.id} className="text-xs border-b border-stone-100 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">{s.title}</span>
                      <span className={`px-2 py-0.5 rounded uppercase font-semibold ${s.status === "approved" ? "bg-emerald-100 text-emerald-800" : s.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{s.status}</span>
                    </div>
                    {s.reviewer_notes && <p className="text-stone-500 mt-1">Note: {s.reviewer_notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
