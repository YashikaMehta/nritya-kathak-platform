import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { Gharana } from "../types";

const GharanasPage: React.FC = () => {
  const [gharanas, setGharanas] = useState<Gharana[]>([]);

  useEffect(() => {
    apiClient.get("/archive/gharanas").then((res) => setGharanas(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Schools & Pedagogical Lineages</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Gharanas of Kathak</h1>
      <p className="text-stone-600 mt-3 max-w-3xl leading-relaxed">
        Explore the four principal gharanas of Kathak—Lucknow, Jaipur, Banaras, and Raigarh—and their distinctive stylistic priorities, rhythmic idioms, and founding lineages.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-10">
        {gharanas.map((g) => (
          <div key={g.id} className="archival-card overflow-hidden flex flex-col justify-between">
            <div>
              {g.image_url && <img src={g.image_url} alt={g.name} className="w-full h-52 object-cover" />}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">{g.origin_region}</span>
                  {g.hindi_name && <span className="text-stone-500 font-medium">{g.hindi_name}</span>}
                </div>
                <h2 className="font-display text-3xl font-bold text-stone-900 mt-2">{g.name}</h2>
                <p className="text-xs text-stone-500 mt-1"><strong>Pioneers:</strong> {g.founder_or_pioneers}</p>
                <p className="text-sm text-stone-700 mt-3 leading-relaxed">{g.stylistic_characteristics}</p>
                {g.cultural_nuance_note && (
                  <p className="text-xs text-stone-600 italic bg-parchment/80 p-3 rounded-lg mt-4 border border-stone-200/80">
                    Note: {g.cultural_nuance_note}
                  </p>
                )}
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link to={`/gharanas/${g.slug}`} className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold hover:bg-crimson-800">
                Explore {g.name} Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {gharanas.length > 0 && (
        <div className="mt-14 archival-card overflow-x-auto p-6">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">Comparative Gharana Overview</h2>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-300 text-xs uppercase text-stone-500">
                <th className="py-3 pr-4">Gharana</th>
                <th className="py-3 pr-4">Region</th>
                <th className="py-3 pr-4">Stylistic Emphasis</th>
                <th className="py-3">Prominent Exponents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {gharanas.map((g) => (
                <tr key={g.id}>
                  <td className="py-3 pr-4 font-bold text-crimson-800">{g.name}</td>
                  <td className="py-3 pr-4 text-stone-600">{g.origin_region}</td>
                  <td className="py-3 pr-4 text-stone-700">{g.rhythm_and_movement_notes}</td>
                  <td className="py-3 text-stone-600 text-xs">{g.prominent_exponents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GharanasPage;
