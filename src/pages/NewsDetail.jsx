// flash10-frontend/src/pages/NewsDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const CATEGORY_ICONS = {
  general: "📰", politics: "🏛️", sports: "⚽",
  entertainment: "🎬", technology: "💻", science: "🔬",
  health: "❤️", business: "💼", world: "🌍", weather: "🌤️",
};

export default function NewsDetail() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Get the return URL saved by NewsCard (preserves category + scroll)
  const returnUrl = sessionStorage.getItem("newslist_return") || "/";

  useEffect(() => {
    apiFetch(`/news/${id}`)
      .then(setNews)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.bookmarks) setBookmarked(user.bookmarks.includes(id));
    else setBookmarked(false);
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();
      if (res.status === 503) {
        setSummary(`⏳ AI model is warming up. Please retry in ${data.retryAfter || 20} seconds.`);
      } else if (!res.ok) {
        setSummary("Failed to generate summary. Please try again.");
      } else {
        setSummary(data.summary);
      }
    } catch {
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
        if (updateUser) updateUser({ bookmarks: (user.bookmarks || []).filter(b => b !== id) });
      } else {
        await apiFetch(`/user/bookmarks/${id}`, { method: "POST" }, user.token);
        setBookmarked(true);
        if (updateUser) updateUser({ bookmarks: [...(user.bookmarks || []), id] });
      }
    } catch (err) { console.error(err); }
    finally { setBookmarkLoading(false); }
  };

  if (loading) return <ArticleLoader />;
  if (!news) return null;

  const icon = CATEGORY_ICONS[news.category] || "📰";
  const date = new Date(news.publishedAt).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const content = news.content && news.content !== "ONLY AVAILABLE IN PAID PLANS"
    ? news.content : news.description || "No content available.";

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      {/* Back — returns to exact category + scroll position */}
      <Link
        to={returnUrl}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "var(--accent)", fontSize: 14, fontWeight: 500, marginBottom: 20,
        }}
      >
        ← Back to Headlines
      </Link>

      <div style={{
        background: "var(--card)", border: "1px solid var(--card-border)",
        borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)",
      }}>
        <img
          src={news.imageUrl || "/default.jpg"}
          alt={news.title}
          onError={(e) => { e.target.src = "/default.jpg"; }}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
        />

        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <span className="category-tag">{icon} {news.category}</span>
            {news.source && <span style={{ fontSize: 12, color: "var(--text2)" }}>📡 {news.source}</span>}
            <span style={{ fontSize: 12, color: "var(--text2)", marginLeft: "auto" }}>{date}</span>
            <button
              className={`bookmark-btn${bookmarked ? " active" : ""}`}
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              title={bookmarked ? "Remove bookmark" : "Save article"}
              style={{ opacity: bookmarkLoading ? 0.5 : 1, fontSize: 18 }}
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

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
                {summarizing ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="btn-spinner" />Summarizing...
                  </span>
                ) : "✨ AI Summary"}
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
              >↺ Regenerate</button>
            </div>
          )}

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text2)", marginBottom: 20 }}>
            {content}
          </p>

          <a href={news.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            🔗 Read Full Article
          </a>
        </div>
      </div>

      <style>{`
        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Beautiful article skeleton loader
function ArticleLoader() {
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="skel" style={{ width: 140, height: 16, borderRadius: 6, marginBottom: 20 }} />
      <div style={{ background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div className="skel" style={{ width: "100%", height: 300 }} />
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="skel" style={{ width: 80, height: 22, borderRadius: 999 }} />
            <div className="skel" style={{ width: 100, height: 22, borderRadius: 999, marginLeft: "auto" }} />
          </div>
          <div className="skel" style={{ width: "95%", height: 28, borderRadius: 6 }} />
          <div className="skel" style={{ width: "80%", height: 28, borderRadius: 6 }} />
          <div className="skel" style={{ width: 120, height: 34, borderRadius: 8, marginTop: 8 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {[95, 88, 92, 70].map((w, i) => (
              <div key={i} className="skel" style={{ width: `${w}%`, height: 16, borderRadius: 4 }} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .skel {
          background: linear-gradient(90deg, var(--card-border) 25%, var(--bg2) 50%, var(--card-border) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  );
}
