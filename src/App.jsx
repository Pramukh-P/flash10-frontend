import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsList from "./components/NewsList.jsx";
import NewsDetail from "./components/NewsDetail.jsx";

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("https://flash10-backend.onrender.com/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch((e) => console.error("API error:", e));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
