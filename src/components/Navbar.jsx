// flash10-frontend/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoSrc from "../assets/full-Logo.png";
import { TbLogout } from "react-icons/tb";

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

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 20px",
          display: "flex", alignItems: "center",
          height: 60, gap: 8,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", marginRight: 16, flexShrink: 0 }}>
            <img src={logoSrc} alt="Flash10" style={{ height: 36, width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: 4, flex: 1, alignItems: "center" }}
            className="desktop-nav">
            <NavLink to="/" active={isActive("/")}>🏠 Home</NavLink>
            {user && <NavLink to="/for-you" active={isActive("/for-you")}>⭐ For You</NavLink>}
            {user && <NavLink to="/bookmarks" active={isActive("/bookmarks")}>🔖 Saved</NavLink>}
          </div>

          {/* Desktop auth actions — compact: avatar + name + preferences + logout */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}
            className="desktop-nav">
            {user ? (
              <>
                <Link to="/preferences" className="btn btn-outline btn-sm"
                  style={{ textDecoration: "none" }}>⚙️ Preferences</Link>

                {/* Compact user avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name-label" style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
                      {user.name.split(" ")[0]}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text2)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email || ""}
                    </div>
                  </div>
                </div>

                <button className="btn btn-sm" onClick={handleLogout}
                  style={{ background: "#fee2e2", color: "#b91c1c", border: "none", flexShrink: 0 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm"
                  style={{ textDecoration: "none" }}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm"
                  style={{ textDecoration: "none" }}>Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              flexDirection: "column", justifyContent: "center",
              alignItems: "center", gap: 5,
              width: 40, height: 40, padding: 8,
              background: "none", border: "none",
              cursor: "pointer", borderRadius: 8,
              marginLeft: "auto",
            }}
          >
            <span style={{
              display: "block", width: 22, height: 2,
              background: "var(--text)", borderRadius: 2,
              transition: "transform 0.3s, opacity 0.3s",
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block", width: 22, height: 2,
              background: "var(--text)", borderRadius: 2,
              transition: "opacity 0.3s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 22, height: 2,
              background: "var(--text)", borderRadius: 2,
              transition: "transform 0.3s, opacity 0.3s",
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className="mobile-only"
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 150,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Slide-in drawer */}
      <div
        className="mobile-only"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: 270, zIndex: 200,
          background: "var(--nav-bg)",
          borderLeft: "1px solid var(--nav-border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column",
          padding: "0 0 32px",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--nav-border)",
        }}>
          <img src={logoSrc} alt="Flash10" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          <button onClick={() => setMenuOpen(false)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, color: "var(--text2)", lineHeight: 1,
            padding: 4, borderRadius: 6,
          }}>✕</button>
        </div>

        {/* User info */}
        {user && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--nav-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #9333ea)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {user.email || "Logged in"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div style={{ flex: 1, padding: "12px 12px" }}>
          <DrawerLink to="/" icon="🏠" label="Home" active={isActive("/")} onClick={() => setMenuOpen(false)} />
          {user && <DrawerLink to="/for-you" icon="⭐" label="For You" active={isActive("/for-you")} onClick={() => setMenuOpen(false)} />}
          {user && <DrawerLink to="/bookmarks" icon="🔖" label="Saved" active={isActive("/bookmarks")} onClick={() => setMenuOpen(false)} />}
          {user && <DrawerLink to="/preferences" icon="⚙️" label="Preferences" active={isActive("/preferences")} onClick={() => setMenuOpen(false)} />}
          {!user && <DrawerLink to="/login" icon="👤" label="Login" active={isActive("/login")} onClick={() => setMenuOpen(false)} />}
          {!user && <DrawerLink to="/register" icon="✏️" label="Sign Up" active={isActive("/register")} onClick={() => setMenuOpen(false)} />}
        </div>

        {/* Logout at bottom */}
        {user && (
          <div style={{ padding: "0 12px" }}>
            <button onClick={handleLogout} style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 7, padding: "12px 14px", borderRadius: 10,
              background: "#fee2e2", color: "#b91c1c",
              border: "none", cursor: "pointer",
              fontSize: 16, fontWeight: 600,
            }}>
              Logout <span style={{ fontSize: 16 }}><TbLogout /></span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* ✅ Raised breakpoint to 900px so mid-size laptop tabs use the drawer */
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }

        /* ✅ Hide email label at medium sizes to save space */
        @media (max-width: 1100px) {
          .user-name-label { display: none !important; }
        }

        body { padding-bottom: 0; }
      `}</style>
    </>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: "6px 12px", borderRadius: 8,
      fontSize: 14, fontWeight: active ? 600 : 400,
      color: active ? "var(--accent)" : "var(--text2)",
      background: active ? "var(--tag-bg)" : "transparent",
      textDecoration: "none", transition: "all 0.15s",
    }}>{children}</Link>
  );
}

function DrawerLink({ to, icon, label, active, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderRadius: 10, marginBottom: 4,
      fontSize: 14, fontWeight: active ? 600 : 400,
      color: active ? "var(--accent)" : "var(--text)",
      background: active ? "var(--tag-bg)" : "transparent",
      textDecoration: "none", transition: "background 0.15s, color 0.15s",
    }}>
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
      {label}
      {active && (
        <span style={{
          marginLeft: "auto", width: 6, height: 6,
          borderRadius: "50%", background: "var(--accent)",
        }} />
      )}
    </Link>
  );
}