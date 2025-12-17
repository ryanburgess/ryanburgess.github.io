import { NavLink, Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="logo">
        <Link to="/" className="logo-link" aria-label="Go to homepage">
          <span className="logo-main">Ryan Burgess</span>
          <span className="logo-sub">Photography</span>
        </Link>
      </div>

      {/* Mobile nav toggle (CSS-driven) */}
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Toggle navigation">
        <span></span>
      </label>

      <nav className="site-nav" aria-label="Primary">
        <NavLink to="/portfolio" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
          Portfolio
        </NavLink>
        <NavLink to="/store" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
          Store
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
}