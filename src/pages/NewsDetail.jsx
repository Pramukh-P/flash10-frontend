// flash10-frontend/src/pages/NewsDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORY_ICONS = {
  general: "📰", politics: "🏛️", sports: "⚽",
  entertainment: "🎬", technology: "💻", science: "🔬",
  health: "❤️", business: "💼", world: "🌍", weather: "🌤️",
};

export default function NewsDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    apiFetch(`/news/${id}`)
      .then(setNews)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if bookmarked
  useEffect(() => {
    if (user && user.bookmarks) {
      setBookmarked(user.bookmarks.includes(id));
    }
  }, [user, id]);

  const handleSummarize = async () => {
    if (!user) { navigate("/login"); return; }
    setSummarizing(true);
    setSummary("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "https://flash10-backend.onrender.com"}/news/${id}/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.status === 503) {
        // HF model is cold-starting
        setSummary(`⏳ AI model is warming up. Please try again in ${data.retryAfter || 20} seconds.`);
      } else if (!res.ok) {
        setSummary("Failed to generate summary. Please try again.");
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) { navigate("/login"); return; }
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await apiFetch(`/user/bookmarks/${id}`, { method: "DELETE" }, user.token);
        setBookmarked(false);
      } else {
        await apiFetch(`/user/bookmarks/${id}`, { method: "POST" }, user.token);
        setBookmarked(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!news) return null;

  const icon = CATEGORY_ICONS[news.category] || "📰";
  const date = new Date(news.publishedAt).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const content = news.content && news.content !== "ONLY AVAILABLE IN PAID PLANS"
    ? news.content
    : news.description || "No content available.";

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      {/* Back */}
      <Link to="/" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: "var(--accent)", fontSize: 14, fontWeight: 500,
        marginBottom: 20,
      }}>← Back to Headlines</Link>

      {/* Article */}
      <div style={{
        background: "var(--card)", border: "1px solid var(--card-border)",
        borderRadius: "var(--radius)", overflow: "hidden",
        boxShadow: "var(--shadow)",
      }}>
        {/* Image */}
        <img
          src={news.imageUrl || "/default.jpg"}
          alt={news.title}
          onError={(e) => { e.target.src = "/default.jpg"; }}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
        />

        <div style={{ padding: "24px" }}>
          {/* Meta */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <span className="category-tag">{icon} {news.category}</span>
            {news.source && (
              <span style={{ fontSize: 12, color: "var(--text2)" }}>📡 {news.source}</span>
            )}
            <span style={{ fontSize: 12, color: "var(--text2)", marginLeft: "auto" }}>{date}</span>

            {/* Bookmark button */}
            <button
              className={`bookmark-btn${bookmarked ? " active" : ""}`}
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              title={bookmarked ? "Remove bookmark" : "Save article"}
            >
              {bookmarked ? "🔖" : "🔕"}
            </button>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, lineHeight: 1.35, marginBottom: 16 }}>
            {news.title}
          </h1>

          {/* AI Summarizer */}
          {!summary || summary.startsWith("⏳") ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSummarize}
                disabled={summarizing}
                style={{ alignSelf: "flex-start" }}
              >
                {summarizing ? "⏳ Summarizing..." : "✨ AI Summary (Free)"}
                {!user && <span style={{ fontSize: 11, opacity: 0.8 }}> (Login required)</span>}
              </button>
              {summary?.startsWith("⏳") && (
                <p style={{ fontSize: 13, color: "var(--text2)" }}>{summary}</p>
              )}
            </div>
          ) : (
            <div className="summary-box">
              <h4>✨ AI Summary</h4>
              <p>{summary}</p>
              <button
                onClick={() => setSummary("")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#4338ca", marginTop: 8 }}
              >
                ↺ Regenerate
              </button>
            </div>
          )}

          {/* Content */}
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text2)", marginBottom: 20 }}>
            {content}
          </p>

          {/* Read more */}
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            🔗 Read Full Article
          </a>
        </div>
      </div>
    </div>
  );
}
