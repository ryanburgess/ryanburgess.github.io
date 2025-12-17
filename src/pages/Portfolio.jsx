import SiteLayout from "../layout/SiteLayout";

export default function Portfolio() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Portfolio</h1>
          <p>Selected work — street, color, and moments with texture.</p>
        </div>
      </section>

      <section className="portfolio-grid-wrap">
        <div className="portfolio-grid">
          <div className="portfolio-item" />
          <div className="portfolio-item" />
          <div className="portfolio-item" />
          <div className="portfolio-item" />
          <div className="portfolio-item" />
          <div className="portfolio-item" />
          <div className="portfolio-item" />
          <div className="portfolio-item" />
        </div>
      </section>
    </SiteLayout>
  );
}