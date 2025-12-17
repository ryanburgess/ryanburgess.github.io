import SiteLayout from "../layout/SiteLayout";

export default function About() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>About</h1>
          <p>
            I’m Ryan — I photograph color, street moments, and everyday life.
            This site is where I share my portfolio and releases.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-inner">
          <h2>What I’m chasing</h2>
          <p>
            Bold color, strong composition, and images that feel alive — the kind
            you want to live with on your wall or revisit in print.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}