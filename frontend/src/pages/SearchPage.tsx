import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import apiClient from "../api/client";
import { SearchResultItem } from "../types";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    const qVal = searchParams.get("q") || "";
    setQuery(qVal);
    if (qVal.trim()) {
      apiClient.get("/search", { params: { q: qVal, category } }).then((res) => setResults(res.data.results || [])).catch(() => {});
    }
  }, [searchParams, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold text-stone-900">Search the NRITYA Archive</h1>
      <form onSubmit={handleSearch} className="mt-5 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history, gharanas, artists, taals, compositions..." className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm" />
        </div>
        <button type="submit" className="px-5 py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold">Search</button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {["all", "history", "gharanas", "artists", "taal", "glossary", "compositions", "events"].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 rounded text-xs font-semibold capitalize ${category === cat ? "bg-crimson-700 text-white" : "bg-white border border-stone-300 text-stone-700"}`}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-stone-500 mt-6">{results.length} matching records found</p>
      <div className="space-y-4 mt-4">
        {results.map((item, idx) => (
          <Link key={`${item.entity_type}-${item.id}-${idx}`} to={item.url} className="archival-card p-5 block group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-crimson-700">{item.badge}</span>
              <span className="text-stone-500">{item.subtitle}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-1 group-hover:text-crimson-700">{item.title}</h2>
            <p className="text-sm text-stone-600 mt-1.5">{item.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
