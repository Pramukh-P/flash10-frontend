import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NewsList() {
  const [newsByDay, setNewsByDay] = useState({});

  useEffect(() => {
    fetch("https://flash10-backend.onrender.com/news")
      .then((res) => res.json())
      .then((data) => {
        // Ensure each day’s news is an array
        const safeData = {};
        Object.entries(data).forEach(([day, newsList]) => {
          safeData[day] = Array.isArray(newsList) ? newsList : [];
        });
        setNewsByDay(safeData);
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #f9fafc, #e3f2fd)",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <img src="/full-Logo.png" alt="logo" width={220} />

      <h2 style={{ fontSize: "28px", marginBottom: "10px", color: "#1e293b" }}>
        Top Headlines
      </h2>

      {Object.keys(newsByDay).length === 0 && <p>Loading...</p>}

      {Object.entries(newsByDay).map(([dayLabel, newsList]) => (
        <div key={dayLabel} style={{ marginBottom: 50 }}>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "700",
              margin: "20px 0 10px",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "24px",
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                borderRadius: "3px",
                marginRight: "10px",
              }}
            />
            {dayLabel}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {(Array.isArray(newsList) ? newsList : [])
              .sort(
                (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
              )
              .map((item) => (
                <Link
                  to={`/news/${item._id}`}
                  key={item._id}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      height: "320px",
                      boxShadow:
                        "0 4px 10px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0,0,0,0.05)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 10px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <img
                      src={item.imageUrl || "/default.jpg"}
                      alt="news"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "12px 16px" }}>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#111827",
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
