// flash10-frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import NewsList from "./pages/NewsList.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import ForYou from "./pages/ForYou.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Preferences from "./pages/Preferences.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
