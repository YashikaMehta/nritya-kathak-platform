import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import { MovementVocabulary } from "../types";

const MovementsPage: React.FC = () => {
  const [items, setItems] = useState<MovementVocabulary[]>([]);

  useEffect(() => {
    apiClient.get("/archive/movements").then((res) => setItems(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Anga, Hasta & Nritta Technique</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Mudras, Hastaks & Movement Vocabulary</h1>
      <p className="text-stone-600 mt-3 max-w-3xl">Foundational arm trajectories, single and combined hand gestures, body alignment, and chakkar technique in Kathak.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {items.map((m) => (
          <div key={m.id} className="archival-card p-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-crimson-700">{m.category}</span>
              {m.hindi_name && <span className="text-stone-500">{m.hindi_name}</span>}
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">{m.name}</h2>
            <p className="text-sm text-stone-700 mt-3 leading-relaxed">{m.description}</p>
            <p className="text-xs text-stone-600 mt-3"><strong>Contextual Usage:</strong> {m.contextual_usage}</p>
            {m.regional_or_style_notes && <p className="text-xs text-stone-500 mt-1.5 italic">{m.regional_or_style_notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementsPage;
