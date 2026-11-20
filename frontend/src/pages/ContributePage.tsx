import React, { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const ContributePage: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [submissionType, setSubmissionType] = useState("article");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [sourceReferences, setSourceReferences] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">Sign In to Contribute</h1>
        <p className="text-sm text-stone-600 mt-2">Registered learners, teachers, and researchers can submit archival notes, glossary entries, or citations for editorial review.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold">Sign In</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-lg border border-stone-300 text-sm font-semibold">Create Account</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiClient.post("/community/submissions", {
        submission_type: submissionType, title, summary, content_body: contentBody,
        gharana_or_category: category || undefined, source_references: sourceReferences, rights_confirmed: rightsConfirmed,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to submit contribution.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Editorial Moderation Workflow</span>
      <h1 className="font-display text-4xl font-bold text-stone-900 mt-1">Contribute to the NRITYA Archive</h1>
      <p className="text-sm text-stone-600 mt-2">All community submissions are reviewed by archive curators before publication to ensure scholarly accuracy and attribution.</p>

      {submitted ? (
        <div className="archival-card p-8 mt-8 bg-emerald-50/70 border-emerald-300">
          <h2 className="font-display text-2xl font-bold text-emerald-900">Submission Received for Curatorial Review</h2>
          <p className="text-sm text-emerald-800 mt-2">Thank you! You can track the review status in your personal dashboard.</p>
          <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 rounded-md bg-crimson-700 text-white text-sm font-semibold">Go to My Dashboard</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="archival-card p-6 sm:p-8 mt-8 space-y-5">
          {error && <div className="p-3 rounded bg-red-50 text-red-800 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Contribution Type</label>
              <select value={submissionType} onChange={(e) => setSubmissionType(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md bg-white">
                <option value="article">Historical / Pedagogical Note</option>
                <option value="glossary">Glossary / Terminology Entry</option>
                <option value="composition">Composition / Bol Documentation</option>
                <option value="resource">Bibliography / Learning Resource</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Gharana or Topic Area</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Lucknow Gharana, Teentaal" className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Title *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Brief Summary *</label>
            <input type="text" required value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Detailed Content *</label>
            <textarea rows={6} required value={contentBody} onChange={(e) => setContentBody(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Source References & Guru/Text Attribution *</label>
            <textarea rows={2} required value={sourceReferences} onChange={(e) => setSourceReferences(e.target.value)} placeholder="Cite books, gurus, institutions, or archival records..." className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <label className="flex items-center gap-2 text-xs text-stone-700">
            <input type="checkbox" checked={rightsConfirmed} onChange={(e) => setRightsConfirmed(e.target.checked)} required />
            I confirm that I have the right to share this educational text and have attributed traditional sources accurately.
          </label>
          <button type="submit" className="px-6 py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold hover:bg-crimson-800">Submit for Review</button>
        </form>
      )}
    </div>
  );
};

export default ContributePage;
