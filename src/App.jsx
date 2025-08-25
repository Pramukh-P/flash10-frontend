// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsList from "./components/NewsList.jsx";
import NewsDetail from "./components/NewsDetail.jsx";

function App() {
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
