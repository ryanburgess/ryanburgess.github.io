import SiteLayout from "../layout/SiteLayout";
import { useEffect, useMemo, useState } from "react";

const PORTFOLIO_SECTIONS = [
  { id: "san-francisco", title: "San Francisco", count: 10 },
  { id: "los-angeles", title: "Los Angeles", count: 8 },
  { id: "tahoe", title: "Tahoe", count: 8 },
  { id: "tokyo", title: "Tokyo", count: 10 },
  { id: "osaka", title: "Osaka", count: 8 },
  { id: "kyoto", title: "Kyoto", count: 8 },
];

function makePlaceholders(n, keyPrefix) {
  return Array.from({ length: n }, (_, i) => ({
    id: `${keyPrefix}-${i + 1}`,
    label: `Image ${i + 1}`,
  }));
}

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const [scrollTarget, setScrollTarget] = useState(null);

  const sections = useMemo(() => {
    if (active === "all") return PORTFOLIO_SECTIONS;
    return PORTFOLIO_SECTIONS.filter((s) => s.id === active);
  }, [active]);

  useEffect(() => {
    if (!scrollTarget) return;
    // Wait a tick so the filtered section is in the DOM
    requestAnimationFrame(() => {
      const el = document.getElementById(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // If we're filtering and the section isn't mounted yet, try once more
        setTimeout(() => {
          const el2 = document.getElementById(scrollTarget);
          if (el2) el2.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }
      setScrollTarget(null);
    });
  }, [scrollTarget, active]);

  const handleChipClick = (id) => (e) => {
    e.preventDefault();
    // Update dropdown selection to match chip
    setActive(id);
    // Scroll once the section is rendered
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
              {PORTFOLIO_SECTIONS.map((s) => (
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

            {PORTFOLIO_SECTIONS.map((s) => (
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
          {sections.map((section) => {
            const items = makePlaceholders(section.count, section.id);

            return (
              <div key={section.id} className="portfolio-section" id={section.id}>
                <div className="portfolio-section-header">
                  <h2>{section.title}</h2>
                  <p className="muted">A curated set — replace these placeholders with your images.</p>
                </div>

                <div className="portfolio-grid">
                  {items.map((item) => (
                    <div key={item.id} className="portfolio-tile" role="img" aria-label={`${section.title} ${item.label}`}>
                      <div className="portfolio-tile-overlay">
                        <span className="portfolio-tile-label">{section.title}</span>
                        <span className="portfolio-tile-sub">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}