// flash10-frontend/src/components/NewsCard.jsx
import { Link, useLocation } from "react-router-dom";

const CATEGORY_ICONS = {
  general: "📰", politics: "🏛️", sports: "⚽",
  entertainment: "🎬", technology: "💻", science: "🔬",
  health: "❤️", business: "💼", world: "🌍", weather: "🌤️",
};

export default function NewsCard({ item }) {
  const location = useLocation();
  const icon = CATEGORY_ICONS[item.category] || "📰";
  const date = new Date(item.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });

  const handleClick = () => {
    // Save current scroll position AND full URL (with category/search/date params)
    sessionStorage.setItem("newslist_scroll", window.scrollY.toString());
    sessionStorage.setItem("newslist_return", location.pathname + location.search);
  };

  return (
    <Link to={`/news/${item._id}`} style={{ textDecoration: "none" }} onClick={handleClick}>
      <div className="card">
        <img
          className="card-img"
          src={item.imageUrl || "/default.jpg"}
          alt={item.title}
          onError={(e) => { e.target.src = "/default.jpg"; }}
          loading="lazy"
        />
        <div className="card-body">
          <h4 className="card-title">{item.title}</h4>
          <div className="card-meta">
            <span className="category-tag">{icon} {item.category}</span>
            {item.source && (
              <span style={{ fontSize: 11, color: "var(--text2)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.source}
              </span>
            )}
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text2)" }}>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
