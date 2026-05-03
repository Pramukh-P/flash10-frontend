// flash10-frontend/src/pages/ForYou.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../utils/api.js";
import NewsCard from "../components/NewsCard.jsx";

export default function ForYou() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    apiFetch("/news/feed/for-you", {}, user.token)
      .then((data) => setNews(data.news || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="page">
      <h1 className="page-title">⭐ For You</h1>
      <p className="page-sub">
        News curated based on your interests:{" "}
        {user.preferences?.map((p) => (
          <span key={p} className="category-tag" style={{ marginRight: 4 }}>{p}</span>
        ))}
        {" "}
        <Link to="/preferences" style={{ color: "var(--accent)", fontSize: 13 }}>
          Edit preferences →
        </Link>
      </p>

      {loading ? (
        <div className="spinner" />
      ) : news.length === 0 ? (
        <div className="empty-state">
          <h3>No articles yet</h3>
          <p>Update your <Link to="/preferences" style={{ color: "var(--accent)" }}>preferences</Link> to get personalized news</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
