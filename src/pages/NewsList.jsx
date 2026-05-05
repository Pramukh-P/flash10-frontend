// flash10-frontend/src/pages/NewsList.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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

const CACHE_KEY = "newslist_cache";

export default function NewsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("cat") || "all");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);

  // Load cached news instantly — no flash to empty state
  const [news, setNews] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached).news : [];
    } catch { return []; }
  });

  // true only on initial back-navigation render — suppress loader
  const isRestoringScroll = useRef(
    !!sessionStorage.getItem("newslist_scroll")
  );
  const [loading, setLoading] = useState(!isRestoringScroll.current);
  const scrollRestored = useRef(false);
  const didMount = useRef(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change (but not on mount)
  useEffect(() => {
    if (!didMount.current) return;
    setPage(1);
    isRestoringScroll.current = false;
  }, [category, debouncedSearch, dateFilter]);

  useEffect(() => { didMount.current = true; }, []);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (category !== "all") params.cat = category;
    if (debouncedSearch) params.q = debouncedSearch;
    if (dateFilter) params.date = dateFilter;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [category, debouncedSearch, dateFilter, page]);

  // Fetch news
  useEffect(() => {
    // If restoring scroll, show cached data first without loader,
    // then silently refresh in background
    const silent = isRestoringScroll.current;
    if (!silent) setLoading(true);

    const params = new URLSearchParams({ category, page, limit: 20 });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (dateFilter) params.set("date", dateFilter);

    apiFetch(`/news?${params}`)
      .then((data) => {
        const fetched = data.news || [];
        setNews(fetched);
        setTotalPages(data.totalPages || 1);
        // Update cache with fresh data
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ news: fetched }));
        } catch {}
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, page, debouncedSearch, dateFilter]);

  // Restore scroll — runs after news is painted
  useEffect(() => {
    if (scrollRestored.current) return;
    const savedScroll = sessionStorage.getItem("newslist_scroll");
    if (!savedScroll) return;

    scrollRestored.current = true;

    // Use requestAnimationFrame to scroll after browser has painted
    const tryScroll = (attempts = 0) => {
      const target = parseInt(savedScroll);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll >= target || attempts > 10) {
        // instant jump — no animation, no flash
        window.scrollTo({ top: target, behavior: "instant" });
        sessionStorage.removeItem("newslist_scroll");
      } else {
        // Page not tall enough yet — wait for next frame
        requestAnimationFrame(() => tryScroll(attempts + 1));
      }
    };

    requestAnimationFrame(() => tryScroll());
  }, [news]);

  // Group by dayTag
  const grouped = news.reduce((acc, item) => {
    const day = item.dayTag || new Date(item.publishedAt).toISOString().split("T")[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});
  const sortedDays = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  // Date options for last 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const val = d.toISOString().split("T")[0];
    const label = i === 0 ? "Today" : i === 1 ? "Yesterday"
      : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    return { val, label };
  });

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">📰 Flash10 News</h1>
        <p className="page-sub">Stay updated with the latest headlines</p>

        {/* Search + Date filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200, maxWidth: 480 }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search headlines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)" }}>
                ✕
              </button>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                padding: "10px 36px 10px 14px",
                border: `1.5px solid ${dateFilter ? "var(--accent)" : "var(--card-border)"}`,
                borderRadius: 10,
                background: dateFilter ? "var(--tag-bg)" : "var(--card)",
                color: dateFilter ? "var(--accent)" : "var(--text)",
                fontSize: 14, outline: "none", cursor: "pointer",
                appearance: "none",
                fontWeight: dateFilter ? 600 : 400,
              }}
            >
              <option value="">📅 All dates</option>
              {dateOptions.map((d) => (
                <option key={d.val} value={d.val}>{d.label}</option>
              ))}
            </select>
            <span style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
              color: "var(--text2)", fontSize: 12,
            }}>▼</span>
          </div>
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

      {/* Show loader only on fresh navigations, not on back */}
      {loading && news.length === 0 ? (
        <NewsLoader />
      ) : news.length === 0 ? (
        <div className="empty-state">
          <h3>No articles found</h3>
          <p>{debouncedSearch ? `No results for "${debouncedSearch}"` : "Check back later for updates"}</p>
        </div>
      ) : (
        <>
          {sortedDays.map((day) => (
            <div key={day}>
              <div className="day-header">
                <div className="day-header-bar" />
                <h3>{formatDay(day)}</h3>
                <span style={{ fontSize: 12, color: "var(--text2)", marginLeft: 8 }}>
                  {grouped[day].length} articles
                </span>
              </div>
              <div className="news-grid">
                {grouped[day].map((item) => (
                  <NewsCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span style={{ padding: "6px 12px", fontSize: 14, color: "var(--text2)" }}>
                {page} / {totalPages}
              </span>
              <button className="btn btn-outline btn-sm" disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NewsLoader() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "32px 0 14px" }}>
        <div className="skel" style={{ width: 5, height: 22, borderRadius: 3 }} />
        <div className="skel" style={{ width: 120, height: 20, borderRadius: 6 }} />
      </div>
      <div className="news-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card" style={{ pointerEvents: "none" }}>
            <div className="skel" style={{ width: "100%", height: 170 }} />
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="skel" style={{ width: "90%", height: 16, borderRadius: 4 }} />
              <div className="skel" style={{ width: "75%", height: 16, borderRadius: 4 }} />
              <div className="skel" style={{ width: "55%", height: 16, borderRadius: 4 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <div className="skel" style={{ width: 60, height: 20, borderRadius: 999 }} />
                <div className="skel" style={{ width: 40, height: 20, borderRadius: 999, marginLeft: "auto" }} />
              </div>
            </div>
          </div>
        ))}
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

function formatDay(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}
