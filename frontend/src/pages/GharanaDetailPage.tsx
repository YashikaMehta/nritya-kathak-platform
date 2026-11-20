import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/client";
import BookmarkButton from "../components/BookmarkButton";
import { Gharana } from "../types";

const GharanaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gharana, setGharana] = useState<Gharana | null>(null);

  useEffect(() => {
    if (slug) apiClient.get(`/archive/gharanas/${slug}`).then((res) => setGharana(res.data)).catch(() => {});
  }, [slug]);

  if (!gharana) return <div className="max-w-4xl mx-auto px-4 py-16 text-stone-600">Loading gharana profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/gharanas" className="text-xs font-semibold text-crimson-700 hover:underline">← Back to All Gharanas</Link>
      <div className="archival-card overflow-hidden mt-4">
        {gharana.image_url && <img src={gharana.image_url} alt={gharana.name} className="w-full h-64 object-cover" />}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase text-amber-800 bg-amber-100 px-2.5 py-1 rounded">{gharana.origin_region}</span>
              <h1 className="font-display text-4xl font-bold text-stone-900 mt-2">{gharana.name} {gharana.hindi_name ? `(${gharana.hindi_name})` : ""}</h1>
            </div>
            <BookmarkButton entityType="gharana" entityId={gharana.id} entityTitle={gharana.name} entityUrl={`/gharanas/${gharana.slug}`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-parchment/70 p-4 rounded-lg border border-stone-200 text-sm">
            <div><strong className="text-stone-900 block text-xs uppercase">Founders & Pioneers</strong>{gharana.founder_or_pioneers}</div>
            <div><strong className="text-stone-900 block text-xs uppercase">Prominent Exponents</strong>{gharana.prominent_exponents}</div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">Historical Background</h2>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">{gharana.historical_background}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">Stylistic Characteristics</h2>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">{gharana.stylistic_characteristics}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">Rhythm, Movement & Performance Traditions</h2>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">{gharana.rhythm_and_movement_notes} {gharana.performance_traditions}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">Notable Contributions</h2>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">{gharana.notable_contributions}</p>
          </div>

          {gharana.references && gharana.references.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h3 className="text-xs font-semibold uppercase text-stone-500">Citations & Archival Sources</h3>
              <ul className="mt-2 space-y-1 text-xs text-stone-600">
                {gharana.references.map((r) => <li key={r.id}>• {r.citation_text}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GharanaDetailPage;
