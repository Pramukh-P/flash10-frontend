// flash10-frontend/src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/full-Logo.png";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            position: "sticky", top: 0, zIndex: 100,
            background: "var(--nav-bg)",
            borderBottom: "1px solid var(--nav-border)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
        }}>
            <div className="nav-container">

                {/* LEFT */}
                <div className="nav-left">
                    <Link to="/">
                        <img className="logo" src={logo} alt="logo" />
                    </Link>
                </div>

                {/* CENTER */}
                <div className="nav-center">
                    <NavLink to="/" active={isActive("/")}>🏠 Home</NavLink>
                    {user && <NavLink to="/for-you" active={isActive("/for-you")}>⭐ For You</NavLink>}
                    {user && <NavLink to="/bookmarks" active={isActive("/bookmarks")}>🔖 Saved</NavLink>}
                </div>

                {/* RIGHT */}
                <div className="nav-right">
                    {user ? (
                        <>
                            <Link to="/preferences" className="btn btn-outline btn-sm">⚙️ Preferences</Link>
                            <span style={{ fontSize: 13 }}>Hi, {user.name.split(" ")[0]}</span>
                            <button className="btn btn-sm" onClick={handleLogout}
                                style={{ background: "#fee2e2", color: "#b91c1c" }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>

            </div>

            {/* Mobile bottom nav */}
            <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "var(--nav-bg)", borderTop: "1px solid var(--nav-border)",
                display: "flex", justifyContent: "space-around", padding: "8px 0 12px",
                backdropFilter: "blur(12px)", zIndex: 100,
            }} className="mobile-bottom-nav">
                <MobileNav to="/" icon="🏠" label="Home" active={isActive("/")} />
                {user
                    ? <MobileNav to="/for-you" icon="⭐" label="For You" active={isActive("/for-you")} />
                    : <MobileNav to="/login" icon="👤" label="Login" active={isActive("/login")} />
                }
                {user && <MobileNav to="/bookmarks" icon="🔖" label="Saved" active={isActive("/bookmarks")} />}
                {user && <MobileNav to="/preferences" icon="⚙️" label="Prefs" active={isActive("/preferences")} />}
            </div>

            <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          nav > div { padding-bottom: 0 !important; }
        }
        @media (min-width: 641px) {
          .mobile-bottom-nav { display: none !important; }
        }
        body { padding-bottom: 0; }
        @media (max-width: 640px) { body { padding-bottom: 70px; } }
      `}</style>
        </nav>
    );
}

function NavLink({ to, active, children }) {
    return (
        <Link to={to} style={{
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: active ? 600 : 400,
            color: active ? "var(--accent)" : "var(--text2)",
            background: active ? "var(--tag-bg)" : "transparent",
            textDecoration: "none",
            transition: "all 0.15s",
        }}>{children}</Link>
    );
}

function MobileNav({ to, icon, label, active }) {
    return (
        <Link to={to} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2,
            color: active ? "var(--accent)" : "var(--text2)",
            textDecoration: "none", fontSize: 11, fontWeight: active ? 600 : 400,
        }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            {label}
        </Link>
    );
}
