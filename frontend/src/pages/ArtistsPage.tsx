import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import apiClient from "../api/client";
import { Artist } from "../types";

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [q, setQ] = useState("");
  const [gharana, setGharana] = useState("All");
  const [artistType, setArtistType] = useState("All");

  useEffect(() => {
    apiClient.get("/artists", { params: { q: q || undefined, gharana, artist_type: artistType } }).then((res) => setArtists(res.data)).catch(() => {});
  }, [q, gharana, artistType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Lineage Bearers & Educators</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Artists & Gurus Directory</h1>
      <p className="text-stone-600 mt-3 max-w-3xl">Explore verified biographical profiles of historic maestros, contemporary performers, and senior educators.</p>

      <div className="flex flex-wrap items-center gap-3 mt-6 bg-white p-4 rounded-xl border border-stone-200">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city, or institution..." className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-md" />
        </div>
        <select value={gharana} onChange={(e) => setGharana(e.target.value)} className="px-3 py-2 text-sm border border-stone-300 rounded-md bg-white">
          <option value="All">All Gharanas</option>
          <option value="Lucknow">Lucknow Gharana</option>
          <option value="Jaipur">Jaipur Gharana</option>
          <option value="Banaras">Banaras Gharana</option>
          <option value="Raigarh">Raigarh Gharana</option>
        </select>
        <select value={artistType} onChange={(e) => setArtistType(e.target.value)} className="px-3 py-2 text-sm border border-stone-300 rounded-md bg-white">
          <option value="All">All Categories</option>
          <option value="Historical & Legendary">Historical & Legendary</option>
          <option value="Contemporary Performer">Contemporary Performer</option>
          <option value="Guru & Educator">Guru & Educator</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {artists.map((a) => (
          <Link key={a.id} to={`/artists/${a.slug}`} className="archival-card overflow-hidden flex flex-col justify-between group">
            <div>
              {a.image_url && <img src={a.image_url} alt={a.name} className="w-full h-52 object-cover" />}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-crimson-700">{a.gharana_label || a.artist_type}</span>
                  <span className="text-stone-500">{a.birth_death_years}</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mt-1 group-hover:text-crimson-700">
                  {a.honorific ? `${a.honorific} ` : ""}{a.name}
                </h2>
                {a.institution && <p className="text-xs text-stone-500 mt-0.5">{a.institution}</p>}
                <p className="text-sm text-stone-600 mt-3 line-clamp-3">{a.short_bio}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <span className="text-xs font-semibold text-crimson-700">Read Full Biography →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
