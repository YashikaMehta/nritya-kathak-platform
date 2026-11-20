import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { CommunitySubmission } from "../types";

const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);

  const loadData = () => {
    apiClient.get("/admin/stats").then((res) => setStats(res.data)).catch(() => {});
    apiClient.get("/admin/submissions").then((res) => setSubmissions(res.data)).catch(() => {});
  };

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

  if (loading) return <div className="p-12 text-center text-sm text-stone-500">Loading curator panel...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const handleReview = async (id: number, status: "approved" | "rejected") => {
    await apiClient.put(`/admin/submissions/${id}`, {
      status,
      reviewer_notes: status === "approved" ? "Verified and published by NRITYA curator." : "Requires additional primary citation.",
    });
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Curatorial Governance</span>
        <h1 className="font-display text-4xl font-bold text-stone-900 mt-1">NRITYA Archive Administration</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="archival-card p-4 text-center">
            <div className="font-display text-3xl font-bold text-crimson-800">{v}</div>
            <div className="text-[11px] uppercase tracking-wider text-stone-500 mt-1">{k.replace(/_/g, " ")}</div>
          </div>
        ))}
      </div>

      <section className="archival-card p-6">
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">Community Submission Moderation Queue</h2>
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-4 rounded-lg border border-stone-200 bg-ivory/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase text-crimson-700">{sub.submission_type} • By {sub.submitter_name}</span>
                  <h3 className="font-display text-xl font-bold text-stone-900">{sub.title}</h3>
                </div>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded ${sub.status === "approved" ? "bg-emerald-100 text-emerald-800" : sub.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                  {sub.status}
                </span>
              </div>
              <p className="text-sm text-stone-700 mt-2">{sub.content_body}</p>
              <p className="text-xs text-stone-500 mt-2"><strong>References:</strong> {sub.source_references}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleReview(sub.id, "approved")} className="px-3.5 py-1.5 rounded bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800">Approve & Publish</button>
                <button onClick={() => handleReview(sub.id, "rejected")} className="px-3.5 py-1.5 rounded bg-red-700 text-white text-xs font-semibold hover:bg-red-800">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
