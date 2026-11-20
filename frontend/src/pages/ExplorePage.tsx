import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Drum, ExternalLink, Landmark, Library, ScrollText, Sparkles, Users } from "lucide-react";
import apiClient from "../api/client";
import { Institution, LearningResource } from "../types";

const ExplorePage: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [resourceFilter, setResourceFilter] = useState("All");

  useEffect(() => {
    apiClient.get("/archive/overview").then((res) => setCounts(res.data.counts || {})).catch(() => {});
    apiClient.get("/archive/resources").then((res) => setResources(res.data)).catch(() => {});
    apiClient.get("/archive/institutions").then((res) => setInstitutions(res.data)).catch(() => {});
  }, []);

  const sections = [
    { to: "/history", title: "Kathak History & Evolution", count: `${counts.history || 4} Eras`, desc: "Chronological essays covering ancient Kathakars, Braj Rasalila, royal court patronage, and 20th-century revival.", icon: BookOpen },
    { to: "/gharanas", title: "Gharanas of Kathak", count: `${counts.gharanas || 4} Lineages`, desc: "Comparative documentation of Lucknow, Jaipur, Banaras, and Raigarh gharanas.", icon: Landmark },
    { to: "/taal-terminology", title: "Taal System & Glossary", count: `${counts.taals || 6} Taals • ${counts.glossary || 24} Terms`, desc: "Interactive matra cycle player and searchable dictionary of Kathak terminology.", icon: Drum },
    { to: "/compositions", title: "Compositions & Repertoire", count: `${counts.compositions || 12} Forms`, desc: "Structured study of Thaat, Aamad, Salami, Tukra, Toda, Tihai, Paran, Gat, and Kavitt.", icon: ScrollText },
    { to: "/movements", title: "Mudras, Hastaks & Movement", count: `${counts.movements || 5} Modules`, desc: "Classical hand gestures, arm trajectories, stances, and chakkar technique.", icon: Sparkles },
    { to: "/artists", title: "Artists & Gurus Directory", count: "Verified Biographies", desc: "Profiles of historic maestros, contemporary performers, and institutional educators.", icon: Users },
  ];

  const filteredResources = resourceFilter === "All" ? resources : resources.filter((r) => r.category === resourceFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Structured Knowledge Repository</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Explore the Kathak Archive</h1>
        <p className="text-stone-600 mt-3 leading-relaxed">Browse verified educational modules, bibliographic references, rhythmic frameworks, and accredited institutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="archival-card p-6 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-parchment text-crimson-700 flex items-center justify-center group-hover:bg-crimson-700 group-hover:text-white transition-colors">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">{s.count}</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 mt-4 group-hover:text-crimson-700">{s.title}</h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">{s.desc}</p>
            </div>
            <span className="text-xs font-semibold text-crimson-700 mt-5 inline-block">Open Section →</span>
          </Link>
        ))}
      </div>

      <section id="resources" className="mt-16 pt-12 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700 inline-flex items-center gap-1"><Library className="w-3.5 h-3.5" /> Bibliography & Portals</span>
            <h2 className="font-display text-3xl font-bold text-stone-900 mt-1">Curated Learning Resources</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Book", "Institutional Archive", "Research Article"].map((cat) => (
              <button key={cat} onClick={() => setResourceFilter(cat)} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${resourceFilter === cat ? "bg-crimson-700 text-white" : "bg-white border border-stone-300 text-stone-700"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((r) => (
            <div key={r.id} className="archival-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-crimson-700">{r.category}</span>
                  <span>{r.year_published}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900 mt-1.5">{r.title}</h3>
                <p className="text-xs font-medium text-stone-600 mt-0.5">{r.creator_or_institution}</p>
                <p className="text-sm text-stone-600 mt-3">{r.description}</p>
              </div>
              <a href={r.external_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-crimson-700 hover:underline">
                Visit Reference <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 pt-12 border-t border-stone-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Academies & Universities</span>
        <h2 className="font-display text-3xl font-bold text-stone-900 mt-1 mb-6">Notable Kathak Institutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {institutions.map((inst) => (
            <div key={inst.id} className="archival-card p-5">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-amber-800">{inst.city}, {inst.country}</span>
                {inst.founded_year && <span>Est. {inst.founded_year}</span>}
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900 mt-1">{inst.name}</h3>
              {inst.gharana_focus && <p className="text-xs font-medium text-crimson-700 mt-0.5">Focus: {inst.gharana_focus}</p>}
              <p className="text-sm text-stone-600 mt-2">{inst.description}</p>
              {inst.official_website && (
                <a href={inst.official_website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-crimson-700 hover:underline mt-3">
                  Official Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
