import SiteLayout from "../layout/SiteLayout";
import { useEffect, useMemo, useState } from "react";

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const [scrollTarget, setScrollTarget] = useState(null);
  const [sectionsData, setSectionsData] = useState([]);
  const [status, setStatus] = useState("loading");

  // Load portfolio.json
  useEffect(() => {
    fetch("/portfolio.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load portfolio.json");
        return res.json();
      })
      .then((data) => {
        setSectionsData(data.sections || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const sections = useMemo(() => {
    if (active === "all") return sectionsData;
    return sectionsData.filter((s) => s.id === active);
  }, [active, sectionsData]);

  // Scroll after filter change
  useEffect(() => {
    if (!scrollTarget) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(scrollTarget);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollTarget(null);
    });
  }, [scrollTarget, active]);

  const handleChipClick = (id) => (e) => {
    e.preventDefault();
    setActive(id);
    setScrollTarget(id);
  };

  const handleAllClick = (e) => {
    e.preventDefault();
    setActive("all");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Portfolio</h1>
          <p>Selected work by city — street, light, color, and everyday moments.</p>
        </div>
      </section>

      {status === "loading" && (
        <section className="portfolio">
          <div className="portfolio-inner">
            <p className="muted">Loading portfolio…</p>
          </div>
        </section>
      )}

      {status === "error" && (
        <section className="portfolio">
          <div className="portfolio-inner">
            <p className="muted">Unable to load portfolio.</p>
          </div>
        </section>
      )}

      {status === "ready" && (
        <>
          <section className="portfolio-toolbar">
            <div className="portfolio-toolbar-inner">
              <div className="portfolio-filter">
                <label className="portfolio-label" htmlFor="portfolio-city">
                  Browse
                </label>
                <select
                  id="portfolio-city"
                  className="portfolio-select"
                  value={active}
                  onChange={(e) => setActive(e.target.value)}
                >
                  <option value="all">All cities</option>
                  {sectionsData.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="portfolio-jump">
                <a
                  className={`portfolio-chip ${active === "all" ? "is-active" : ""}`}
                  href="#top"
                  onClick={handleAllClick}
                >
                  All
                </a>

                {sectionsData.map((s) => (
                  <a
                    key={s.id}
                    className={`portfolio-chip ${active === s.id ? "is-active" : ""}`}
                    href={`#${s.id}`}
                    onClick={handleChipClick(s.id)}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="portfolio">
            <div id="top" />
            <div className="portfolio-inner">
              {sections.map((section) => (
                <div key={section.id} className="portfolio-section" id={section.id}>
                  <div className="portfolio-section-header">
                    <h2>{section.title}</h2>
                  </div>

                  <div className="portfolio-grid">
                    {(section.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="portfolio-tile"
                        role="img"
                        aria-label={item.alt || item.caption || section.title}
                        style={{ backgroundImage: `url(${item.src})` }}
                      >
                        {(item.caption || item.title) && (
                          <div className="portfolio-tile-overlay">
                            <span className="portfolio-tile-label">
                              {section.title}
                            </span>
                            <span className="portfolio-tile-sub">
                              {item.caption || item.title}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </SiteLayout>
  );
}