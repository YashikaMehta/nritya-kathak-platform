import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Drum, Landmark, Search, Sparkles, Users } from "lucide-react";
import apiClient from "../api/client";
import { Artist, Gharana, GlossaryTerm, KathakEvent } from "../types";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredTerm, setFeaturedTerm] = useState<GlossaryTerm | null>(null);
  const [gharanas, setGharanas] = useState<Gharana[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<KathakEvent[]>([]);

  useEffect(() => {
    apiClient.get("/archive/overview").then((res) => setFeaturedTerm(res.data.featured_term)).catch(() => {});
    apiClient.get("/archive/gharanas").then((res) => setGharanas(res.data)).catch(() => {});
    apiClient.get("/artists").then((res) => setArtists(res.data.slice(0, 4))).catch(() => {});
    apiClient.get("/events").then((res) => setEvents(res.data.slice(0, 3))).catch(() => {});
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div>
      <section className="relative bg-gradient-to-b from-parchment via-ivory to-ivory border-b border-stone-200/80 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-100/90 text-crimson-800 border border-amber-300/80">
              <Sparkles className="w-3.5 h-3.5" /> Digital Kathak Archive & Community Platform
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 mt-4 leading-tight">
              Preserving Tradition. <span className="text-crimson-700">Connecting Generations.</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-700 mt-5 leading-relaxed">
              NRITYA is an open educational archive documenting the history, gharanas, taal systems, classical compositions, gurus, and living community of Kathak.
            </p>
            <form onSubmit={handleHeroSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Teentaal, Lucknow Gharana, Birju Maharaj, Tihai..." className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-stone-300 text-sm shadow-sm focus:outline-none focus:border-crimson-700" />
              </div>
              <button type="submit" className="px-6 py-3 rounded-lg bg-crimson-700 text-white font-semibold text-sm hover:bg-crimson-800 shadow-sm">Search Archive</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link to="/explore" className="inline-flex items-center gap-1.5 font-semibold text-crimson-700 hover:text-crimson-900">Explore Full Archive <ArrowRight className="w-4 h-4" /></Link>
              <span className="text-stone-300">|</span>
              <Link to="/taal-terminology" className="text-stone-700 hover:text-crimson-700 font-medium">Interactive Taal Visualiser</Link>
              <span className="text-stone-300">|</span>
              <Link to="/contribute" className="text-stone-700 hover:text-crimson-700 font-medium">Contribute Research</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { to: "/history", title: "Kathak History", desc: "Trace Kathak from temple Kathakars and court patronage to contemporary stages.", icon: BookOpen },
            { to: "/gharanas", title: "Four Gharanas", desc: "Compare Lucknow, Jaipur, Banaras, and Raigarh lineages and pedagogy.", icon: Landmark },
            { to: "/taal-terminology", title: "Taal & Glossary", desc: "Practice matras interactively and explore bols, compositions, and hastaks.", icon: Drum },
            { to: "/artists", title: "Artists & Gurus", desc: "Discover biographical archives of legendary maestros and contemporary teachers.", icon: Users },
          ].map((pillar) => (
            <Link key={pillar.to} to={pillar.to} className="archival-card p-6 group">
              <div className="w-10 h-10 rounded-lg bg-parchment text-crimson-700 flex items-center justify-center group-hover:bg-crimson-700 group-hover:text-white transition-colors">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 mt-4 group-hover:text-crimson-700">{pillar.title}</h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">{pillar.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {featuredTerm && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl bg-crimson-800 text-ivory p-7 sm:p-9 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">Featured Kathak Term • {featuredTerm.category}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
                {featuredTerm.term} {featuredTerm.hindi_term ? <span className="text-amber-200 font-normal">({featuredTerm.hindi_term})</span> : ""}
              </h2>
              <p className="text-amber-100/95 text-sm sm:text-base mt-2 leading-relaxed">{featuredTerm.detailed_explanation}</p>
            </div>
            <Link to="/taal-terminology" className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-400 text-stone-950 font-semibold text-sm hover:bg-amber-300">
              Open Taal & Glossary <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-crimson-700">Lineages & Pedagogy</span>
            <h2 className="font-display text-3xl font-bold text-stone-900">Kathak Gharanas</h2>
          </div>
          <Link to="/gharanas" className="text-sm font-semibold text-crimson-700 hover:underline">Compare all Gharanas →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gharanas.map((g) => (
            <Link key={g.id} to={`/gharanas/${g.slug}`} className="archival-card overflow-hidden flex flex-col sm:flex-row group">
              {g.image_url && <img src={g.image_url} alt={g.name} className="w-full sm:w-44 h-48 sm:h-auto object-cover shrink-0" />}
              <div className="p-5">
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{g.origin_region}</span>
                <h3 className="font-display text-2xl font-bold text-stone-900 mt-2 group-hover:text-crimson-700">{g.name}</h3>
                <p className="text-sm text-stone-600 mt-2 line-clamp-3">{g.stylistic_characteristics}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-crimson-700">Lineage Bearers</span>
                <h2 className="font-display text-3xl font-bold text-stone-900">Featured Artists & Gurus</h2>
              </div>
              <Link to="/artists" className="text-sm font-semibold text-crimson-700 hover:underline">View Directory →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artists.map((a) => (
                <Link key={a.id} to={`/artists/${a.slug}`} className="archival-card p-4 flex gap-4 items-start group">
                  {a.image_url && <img src={a.image_url} alt={a.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />}
                  <div>
                    <span className="text-[11px] font-semibold uppercase text-crimson-700">{a.gharana_label || a.artist_type}</span>
                    <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-crimson-700">{a.honorific ? `${a.honorific} ` : ""}{a.name}</h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">{a.short_bio}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-crimson-700">Calendar</span>
                <h2 className="font-display text-3xl font-bold text-stone-900">Workshops & Events</h2>
              </div>
              <Link to="/events" className="text-sm font-semibold text-crimson-700 hover:underline">All Events →</Link>
            </div>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="archival-card p-4">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-crimson-700">{ev.category}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {ev.event_date}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-stone-900 mt-1">{ev.title}</h3>
                  <p className="text-xs text-stone-600 mt-1">{ev.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
