import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/client";
import BookmarkButton from "../components/BookmarkButton";
import { Artist } from "../types";

const ArtistDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    if (slug) apiClient.get(`/artists/${slug}`).then((res) => setArtist(res.data)).catch(() => {});
  }, [slug]);

  if (!artist) return <div className="max-w-4xl mx-auto px-4 py-16 text-stone-600">Loading artist biography...</div>;

  const fullName = `${artist.honorific ? `${artist.honorific} ` : ""}${artist.name}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/artists" className="text-xs font-semibold text-crimson-700 hover:underline">← Back to Artists & Gurus</Link>
      <div className="archival-card overflow-hidden mt-4">
        {artist.image_url && <img src={artist.image_url} alt={fullName} className="w-full h-64 object-cover" />}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded">{artist.artist_type} • {artist.gharana_label}</span>
              <h1 className="font-display text-4xl font-bold text-stone-900 mt-2">{fullName}</h1>
              <p className="text-sm text-stone-500 mt-1">{artist.birth_death_years} • {artist.location}</p>
            </div>
            <BookmarkButton entityType="artist" entityId={artist.id} entityTitle={fullName} entityUrl={`/artists/${artist.slug}`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-parchment/70 p-4 rounded-lg border border-stone-200 text-sm">
            {artist.institution && <div><strong className="text-xs uppercase block text-stone-700">Institution / Lineage</strong>{artist.institution}</div>}
            {artist.specialisation && <div><strong className="text-xs uppercase block text-stone-700">Specialisation</strong>{artist.specialisation}</div>}
            {artist.awards_recognitions && <div className="sm:col-span-2"><strong className="text-xs uppercase block text-stone-700">Honours & Recognitions</strong>{artist.awards_recognitions}</div>}
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">Biography</h2>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">{artist.biography}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">Artistic & Pedagogical Contributions</h2>
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">{artist.contributions}</p>
          </div>
          {artist.notable_works && (
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-900">Notable Works & Repertoire</h2>
              <p className="text-sm text-stone-700 mt-2">{artist.notable_works}</p>
            </div>
          )}

          {artist.references && artist.references.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h3 className="text-xs font-semibold uppercase text-stone-500">Archival Citations</h3>
              <ul className="mt-2 space-y-1 text-xs text-stone-600">
                {artist.references.map((r) => <li key={r.id}>• {r.citation_text}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;
