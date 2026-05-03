// flash10-frontend/src/pages/Bookmarks.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../utils/api.js";
import NewsCard from "../components/NewsCard.jsx";

export default function Bookmarks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    apiFetch("/user/bookmarks", {}, user.token)
      .then(setBookmarks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="page">
      <h1 className="page-title">🔖 Saved Articles</h1>
      <p className="page-sub">{bookmarks.length} saved article{bookmarks.length !== 1 ? "s" : ""}</p>

      {loading ? (
        <div className="spinner" />
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">
          <h3>No saved articles</h3>
          <p>Bookmark articles while reading to find them here</p>
        </div>
      ) : (
        <div className="news-grid">
          {bookmarks.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
