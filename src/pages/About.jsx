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
        <div className="content-inner about-page">
          <h2>My Photography</h2>
          <p>I’m a photographer in Los Angeles, focused on street photography with vibrant color.</p>

<p>For 19 years, I worked in tech at companies like Netflix and Evernote. After nearly two decades in that world, I decided to take a break and focus on my creative work.</p>

<p>Photography became that outlet.</p>

<p>What started as a way to slow down and pay attention has grown into a deeper practice. My work centers on street photography in Los Angeles and the cities I visit.</p>

<p>Lately, I’ve been focused on publishing photography magazines and releasing print editions. This site is where those projects live.</p>
        </div>
      </section>
    </SiteLayout>
  );
}