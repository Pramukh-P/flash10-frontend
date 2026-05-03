// flash10-frontend/src/pages/NewsList.jsx
import { useEffect, useState, useCallback } from "react";
import NewsCard from "../components/NewsCard.jsx";
import { apiFetch } from "../utils/api.js";

const CATEGORIES = [
  { key: "all", label: "All", icon: "🗞️" },
  { key: "general", label: "General", icon: "📰" },
  { key: "politics", label: "Politics", icon: "🏛️" },
  { key: "sports", label: "Sports", icon: "⚽" },
  { key: "entertainment", label: "Entertainment", icon: "🎬" },
  { key: "technology", label: "Technology", icon: "💻" },
  { key: "science", label: "Science", icon: "🔬" },
  { key: "health", label: "Health", icon: "❤️" },
  { key: "business", label: "Business", icon: "💼" },
  { key: "world", label: "World", icon: "🌍" },
];

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      category,
      page,
      limit: 20,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    });
    apiFetch(`/news?${params}`)
      .then((data) => {
        setNews(data.news || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, page, debouncedSearch]);

  // Group by dayTag
  const grouped = news.reduce((acc, item) => {
    const day = item.dayTag || new Date(item.publishedAt).toISOString().split("T")[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});
  const sortedDays = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">📰 Flash10 News</h1>
        <p className="page-sub">Stay updated with the latest headlines</p>

        {/* Search */}
        <div className="search-bar" style={{ marginBottom: 14, maxWidth: 480 }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search headlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)" }}
            >✕</button>
          )}
        </div>

        {/* Category pills */}
        <div className="cat-row">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`cat-pill${category === c.key ? " active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="spinner" />
      ) : news.length === 0 ? (
        <div className="empty-state">
          <h3>No articles found</h3>
          <p>
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : "Check back later for updates"}
          </p>
        </div>
      ) : (
        <>
          {sortedDays.map((day) => (
            <div key={day}>
              <div className="day-header">
                <div className="day-header-bar" />
                <h3>{formatDay(day)}</h3>
              </div>
              <div className="news-grid">
                {grouped[day].map((item) => (
                  <NewsCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >← Prev</button>
              <span style={{ padding: "6px 12px", fontSize: 14, color: "var(--text2)" }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatDay(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}
