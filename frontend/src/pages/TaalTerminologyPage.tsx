import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import apiClient from "../api/client";
import TaalVisualizer from "../components/TaalVisualizer";
import { GlossaryTerm, Taal } from "../types";

const TaalTerminologyPage: React.FC = () => {
  const [taals, setTaals] = useState<Taal[]>([]);
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    apiClient.get("/archive/taals").then((res) => setTaals(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    apiClient.get("/archive/glossary", { params: { q: search || undefined, category } }).then((res) => setTerms(res.data)).catch(() => {});
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Rhythmic Grammar & Lexicon</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Taal System & Kathak Terminology</h1>
        <p className="text-stone-600 mt-3 max-w-3xl">Explore foundational Hindustani rhythmic cycles with an interactive matra visualiser, and search our structured glossary of Kathak terms.</p>
      </div>

      {taals.length > 0 && <TaalVisualizer taals={taals} />}

      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-3xl font-bold text-stone-900">Searchable Kathak Glossary ({terms.length})</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter terms..." className="pl-9 pr-3 py-1.5 text-sm bg-white border border-stone-300 rounded-md" />
            </div>
            {["All", "Rhythm & Taal", "Composition", "Performance Structure", "Abhinaya & Expression", "Movement & Hastak"].map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${category === cat ? "bg-crimson-700 text-white" : "bg-white border border-stone-300 text-stone-700"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {terms.map((t) => (
            <div key={t.id} className="archival-card p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-crimson-700">{t.category}</span>
                {t.hindi_term && <span className="text-stone-500">{t.hindi_term}</span>}
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900 mt-1">{t.term}</h3>
              <p className="text-sm font-medium text-stone-800 mt-2">{t.short_definition}</p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{t.detailed_explanation}</p>
              {t.related_terms && <p className="text-[11px] text-amber-900 mt-3 pt-2 border-t border-stone-100"><strong>Related:</strong> {t.related_terms}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TaalTerminologyPage;
