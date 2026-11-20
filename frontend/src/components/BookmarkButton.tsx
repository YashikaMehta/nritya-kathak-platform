import React, { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

interface Props { entityType: string; entityId: number; entityTitle: string; entityUrl: string; }

const BookmarkButton: React.FC<Props> = ({ entityType, entityId, entityTitle, entityUrl }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleBookmark = async () => {
    if (!user) { navigate("/login"); return; }
    setSaving(true);
    try {
      await apiClient.post("/bookmarks", { entity_type: entityType, entity_id: entityId, entity_title: entityTitle, entity_url: entityUrl });
      setSaved(true);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  return (
    <button onClick={handleBookmark} disabled={saving || saved} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${saved ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-white text-stone-700 border-stone-300 hover:border-crimson-700 hover:text-crimson-700"}`}>
      {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
      {saved ? "Saved to Study List" : "Bookmark"}
    </button>
  );
};

export default BookmarkButton;
