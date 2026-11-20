import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { CommunitySubmission, StudentProfile } from "../types";

const CommunityPage: React.FC = () => {
  const [approved, setApproved] = useState<CommunitySubmission[]>([]);
  const [learners, setLearners] = useState<StudentProfile[]>([]);

  useEffect(() => {
    apiClient.get("/community/approved").then((res) => setApproved(res.data)).catch(() => {});
    apiClient.get("/community/learners").then((res) => setLearners(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Peer Learning & Verified Notes</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">NRITYA Community & Showcase</h1>
          <p className="text-stone-600 mt-2 max-w-2xl">Read peer-contributed study notes reviewed by curators and connect with Kathak learners and practitioners.</p>
        </div>
        <Link to="/contribute" className="px-5 py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold hover:bg-crimson-800 self-start">
          + Submit Archival Contribution
        </Link>
      </div>

      <section>
        <h2 className="font-display text-3xl font-bold text-stone-900 mb-5">Curator-Approved Community Articles & Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approved.map((sub) => (
            <div key={sub.id} className="archival-card p-6">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold uppercase text-crimson-700">{sub.gharana_or_category || sub.submission_type}</span>
                <span>By {sub.submitter_name}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900 mt-1.5">{sub.title}</h3>
              <p className="text-sm font-medium text-stone-700 mt-2">{sub.summary}</p>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed whitespace-pre-line">{sub.content_body}</p>
              <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100"><strong>Sources:</strong> {sub.source_references}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-bold text-stone-900 mb-5">Public Learner & Practitioner Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {learners.map((p) => (
            <div key={p.id} className="archival-card p-5">
              <h3 className="font-display text-2xl font-bold text-stone-900">{p.display_name}</h3>
              <p className="text-xs font-semibold text-crimson-700 mt-0.5">{p.experience_level || "Kathak Practitioner"}</p>
              {p.location && <p className="text-xs text-stone-500 mt-0.5">{p.location}</p>}
              {p.gharana_affiliation && <p className="text-xs text-amber-900 mt-1"><strong>Lineage Study:</strong> {p.gharana_affiliation}</p>}
              {p.bio && <p className="text-sm text-stone-600 mt-3">{p.bio}</p>}
              {p.interests && <p className="text-xs text-stone-500 mt-3"><strong>Interests:</strong> {p.interests}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
