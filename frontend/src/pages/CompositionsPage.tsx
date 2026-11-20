import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import BookmarkButton from "../components/BookmarkButton";
import { Composition } from "../types";

const CompositionsPage: React.FC = () => {
  const [items, setItems] = useState<Composition[]>([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    apiClient.get("/archive/compositions", { params: { composition_type: selectedType } }).then((res) => setItems(res.data)).catch(() => {});
  }, [selectedType]);

  const types = ["All", "Thaat", "Aamad", "Salami", "Tukra", "Toda", "Tihai", "Paran", "Chakradhar Paran", "Gat", "Gat Nikas", "Gat Bhav", "Kavitt"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Repertoire & Bol Architecture</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Compositions & Repertoire</h1>
      <p className="text-stone-600 mt-3 max-w-3xl">Explore traditional structural elements of a Kathak recital with syllabic notation, performance context, and pedagogical attribution.</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {types.map((t) => (
          <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${selectedType === t ? "bg-crimson-700 text-white" : "bg-white border border-stone-300 text-stone-700"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {items.map((c) => (
          <div key={c.id} className="archival-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">{c.composition_type} • {c.associated_taal}</span>
                <BookmarkButton entityType="composition" entityId={c.id} entityTitle={c.title} entityUrl={`/compositions?item=${c.slug}`} />
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 mt-2.5">{c.title}</h2>
              {c.gharana_attribution && <p className="text-xs text-stone-500 mt-0.5">{c.gharana_attribution}</p>}
              {c.bol_notation && (
                <div className="mt-3 p-3.5 rounded-lg bg-parchment border border-amber-200/80 font-mono text-xs text-crimson-900 leading-relaxed">
                  {c.bol_notation}
                </div>
              )}
              <p className="text-sm text-stone-700 mt-3 leading-relaxed">{c.explanation}</p>
              <p className="text-xs text-stone-600 mt-2"><strong>Performance Context:</strong> {c.performance_context}</p>
            </div>
            <p className="text-[11px] text-stone-500 mt-4 pt-3 border-t border-stone-100">Source: {c.source_attribution}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompositionsPage;
