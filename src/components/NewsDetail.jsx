// client/src/components/NewsDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    fetch(`https://flash10-backend.onrender.com/news/${id}`)
      .then((res) => res.json())
      .then(setNews)
      .catch((err) => console.error(err));
  }, [id]);

  if (!news) return <p className="text-center text-lg mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Back button */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ⬅ Back to Headlines
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{news.title}</h2>
        </div>

        {/* Image */}
        <div className="w-full flex justify-center my-4">
        <img
          src={news.imageUrl || news.urlToImage || "/default.jpg"}
          alt="news"
          style={{
            width: "100%",
            maxWidth: "400px", // maximum width for large screens
            height: "auto", // keep aspect ratio
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          {news.content && news.content !== "ONLY AVAILABLE IN PAID PLANS"
            ? news.content
            : news.description || "No description available."}
        </p>

        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: "#007BFF",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          🔗 Read more
        </a>
      </div>
    </div>
  );
}
