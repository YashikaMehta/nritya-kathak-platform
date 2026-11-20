import React, { useEffect, useState } from "react";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import apiClient from "../api/client";
import { KathakEvent } from "../types";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<KathakEvent[]>([]);
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");

  useEffect(() => {
    apiClient.get("/events", { params: { category, location: location || undefined } }).then((res) => setEvents(res.data)).catch(() => {});
  }, [category, location]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Seminars, Baithaks & Festivals</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mt-1">Events, Workshops & Lecture-Demonstrations</h1>
      <p className="text-stone-600 mt-3 max-w-3xl">Discover Kathak workshops, academic symposia, and classical recitals. Sample demonstration listings are clearly labelled.</p>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        {["All", "Workshop", "Lecture-Demonstration", "Dance Festival", "Masterclass"].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3.5 py-1.5 rounded-md text-xs font-semibold ${category === cat ? "bg-crimson-700 text-white" : "bg-white border border-stone-300 text-stone-700"}`}>
            {cat}
          </button>
        ))}
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Filter by city..." className="px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {events.map((ev) => (
          <div key={ev.id} className="archival-card overflow-hidden flex flex-col justify-between">
            <div>
              {ev.image_url && <img src={ev.image_url} alt={ev.title} className="w-full h-48 object-cover" />}
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">{ev.category}</span>
                  <span className="inline-flex items-center gap-1 text-stone-600 font-medium"><Calendar className="w-3.5 h-3.5 text-crimson-700" /> {ev.event_date}</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mt-2">{ev.title}</h2>
                <p className="text-xs text-stone-500 mt-1 inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {ev.location} {ev.venue ? `• ${ev.venue}` : ""}</p>
                <p className="text-sm text-stone-700 mt-3 leading-relaxed">{ev.description}</p>
                <p className="text-xs text-stone-600 mt-3"><strong>Organiser:</strong> {ev.organiser}</p>
              </div>
            </div>
            {ev.registration_url && (
              <div className="px-6 pb-6">
                <a href={ev.registration_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-crimson-700 hover:underline">
                  Organiser Portal & Details <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
