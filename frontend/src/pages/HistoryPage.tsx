import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import BookmarkButton from "../components/BookmarkButton";
import { HistoricalArticle } from "../types";

const HistoryPage: React.FC = () => {
  const [articles, setArticles] = useState<HistoricalArticle[]>([]);

  useEffect(() => {
    apiClient.get("/archive/history").then((res) => setArticles(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Chronological Heritage</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">History & Evolution of Kathak</h1>
      <p className="text-stone-600 mt-3 leading-relaxed">
        From ancient temple Kathakars in northern India to royal court mehfils and 20th-century proscenium institutions, trace the unbroken yet adaptable lineage of Kathak.
      </p>

      <div className="space-y-10 mt-10">
        {articles.map((art) => {
          let milestones: string[] = [];
          try { milestones = art.key_milestones ? JSON.parse(art.key_milestones) : []; } catch { milestones = []; }
          return (
            <article key={art.id} id={art.slug} className="archival-card overflow-hidden">
              {art.image_url && (
                <div className="relative h-60 w-full">
                  <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                  {art.image_credit && <span className="absolute bottom-2 right-2 bg-black/65 text-white text-[10px] px-2 py-0.5 rounded">{art.image_credit}</span>}
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-900">{art.era} • {art.period_label}</span>
                  <BookmarkButton entityType="history" entityId={art.id} entityTitle={art.title} entityUrl={`/history#${art.slug}`} />
                </div>
                <h2 className="font-display text-3xl font-bold text-stone-900 mt-3">{art.title}</h2>
                <p className="text-stone-700 font-medium mt-3 leading-relaxed">{art.summary}</p>
                <div className="text-sm text-stone-700 mt-4 space-y-3 leading-relaxed whitespace-pre-line">{art.content}</div>

                {milestones.length > 0 && (
                  <div className="mt-6 bg-parchment/70 p-4 rounded-lg border border-stone-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-crimson-800 mb-2">Key Historical Milestones</h3>
                    <ul className="list-disc list-inside text-sm text-stone-700 space-y-1">
                      {milestones.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                )}

                {art.references && art.references.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-stone-200">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Scholarly Citations</h4>
                    <ul className="mt-1.5 space-y-1 text-xs text-stone-600">
                      {art.references.map((ref) => <li key={ref.id}>• {ref.citation_text}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
