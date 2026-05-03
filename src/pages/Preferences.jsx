// flash10-frontend/src/pages/Preferences.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../utils/api.js";

const ALL_CATEGORIES = [
  { key: "general", label: "General News", icon: "📰", desc: "Top stories across India" },
  { key: "politics", label: "Politics", icon: "🏛️", desc: "Government, elections, policy" },
  { key: "sports", label: "Sports", icon: "⚽", desc: "Cricket, football, Olympics & more" },
  { key: "entertainment", label: "Entertainment", icon: "🎬", desc: "Bollywood, OTT, celebs" },
  { key: "technology", label: "Technology", icon: "💻", desc: "Startups, AI, gadgets" },
  { key: "science", label: "Science", icon: "🔬", desc: "Space, research, discoveries" },
  { key: "health", label: "Health", icon: "❤️", desc: "Medical, wellness, fitness" },
  { key: "business", label: "Business", icon: "💼", desc: "Markets, economy, companies" },
  { key: "world", label: "World", icon: "🌍", desc: "International news" },
];

export default function Preferences() {
  const { user, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(user?.preferences || ["general"]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      setError("Select at least one category");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = await apiFetch(
        "/user/preferences",
        { method: "PUT", body: JSON.stringify({ preferences: selected }) },
        user.token
      );
      updatePreferences(data.preferences);
      setSuccess(true);
      setTimeout(() => navigate("/for-you"), 1200);
    } catch (err) {
      setError(err.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <h1 className="page-title">⚙️ News Preferences</h1>
      <p className="page-sub">
        Choose the topics you care about. Your "For You" feed will be personalized based on these.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">✅ Preferences saved! Redirecting...</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat.key);
          return (
            <button
              key={cat.key}
              onClick={() => toggle(cat.key)}
              style={{
                padding: "14px 16px",
                border: `2px solid ${isSelected ? "var(--accent)" : "var(--card-border)"}`,
                borderRadius: "var(--radius)",
                background: isSelected ? "var(--tag-bg)" : "var(--card)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                boxShadow: isSelected ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: isSelected ? "var(--accent)" : "var(--text)" }}>
                {cat.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{cat.desc}</div>
              {isSelected && (
                <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 6, fontWeight: 600 }}>
                  ✓ Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : `Save Preferences (${selected.length} selected)`}
        </button>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
}
