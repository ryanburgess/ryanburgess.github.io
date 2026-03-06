import SiteLayout from "../layout/SiteLayout";
import { Link } from "react-router-dom";

const featuredImages = [
  "/images/portfolio/portfolio-1.jpg",
  "/images/portfolio/portfolio-2.jpg",
  "/images/portfolio/portfolio-3.jpg",
  "/images/portfolio/portfolio-4.jpg",
  "/images/portfolio/portfolio-5.jpg",
  "/images/portfolio/portfolio-6.jpg",
];

export default function Home() {
  return (
    <SiteLayout>
      {/* Hero section */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1 className="home-title">
            <span className="home-title-line">Ryan Burgess</span>
            <span className="home-title-line home-title-accent">Photography</span>
            </h1>

            <p className="home-subtitle">San Francisco based photographer.</p>

            <div className="home-hero-actions">
              <Link className="btn btn-primary" to="/store">
                Shop Store
              </Link>
              <Link className="btn btn-ghost" to="/portfolio">
                View Portfolio
              </Link>
            </div>
          </div>

          {/* Hero portrait */}
          <div
            className="home-hero-photo"
            role="img"
            aria-label="Portrait of Ryan holding a camera"
            style={{
              backgroundImage: 'url("/images/hero/ryan-hero.jpg")',
            }}
          />
        </div>
      </section>

      {/* Featured work */}
      <section className="featured-work">
        <div className="section-header">
          <h2>Featured Work</h2>
          <p>A few recent favorites.</p>
        </div>

        <div className="featured-grid">
          {featuredImages.map((src, index) => (
            <div
              key={src}
              className="featured-card"
              role="img"
              aria-label={`Featured portfolio image ${index + 1}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}