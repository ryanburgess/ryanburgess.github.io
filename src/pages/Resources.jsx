import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import { fetchResources } from "../lib/resources";

export default function Resources() {
  const [state, setState] = useState({ status: "loading", resources: [], error: null });

  useEffect(() => {
    let alive = true;

    fetchResources()
      .then((data) => {
        if (alive) setState({ status: "ready", resources: data.resources || [], error: null });
      })
      .catch((error) => {
        if (alive) setState({ status: "error", resources: [], error });
      });

    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(state.resources.map((resource) => resource.category))],
    [state.resources]
  );

  return (
    <SiteLayout>
      <section className="page-hero resources-hero">
        <div className="page-hero-inner">
          <span className="resource-eyebrow">Learn &amp; explore</span>
          <h1>Resources</h1>
          <p>Photography resources I’ve put together to help other photographers learn, create, and grow.</p>
        </div>
      </section>

      <section className="resource-hub-featured" aria-labelledby="resource-hub-featured-title">
        <div className="resources-inner">
          <div className="resource-hub-heading">
            <span className="resource-eyebrow">Start here</span>
            <h2 id="resource-hub-featured-title">Guides &amp; tools</h2>
          </div>
          <div className="resource-hub-grid">
            <article className="resource-hub-card resource-hub-card--guide">
              <div>
                <span>Free download</span>
                <h3>Color Exposure Cheat Sheet</h3>
                <p>A quick field reference for exposure adjustments across common colors and tones.</p>
              </div>
              <Link to="/guides/color-cheat-sheet">Get the guide <span aria-hidden="true">→</span></Link>
            </article>
            <article className="resource-hub-card resource-hub-card--collection">
              <div>
                <span>Community collection</span>
                <h3>Photography Resources</h3>
                <p>Browse reviewed photography links or suggest a useful resource for the collection.</p>
              </div>
              <Link to="/resources/photography">Explore the collection <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </div>
      </section>

      {state.status !== "ready" || state.resources.length > 0 ? (
      <section className="resources-section" aria-live="polite">
        <div className="resources-inner">
          {state.status === "loading" ? <p className="resource-status">Loading resources…</p> : null}

          {state.status === "error" ? (
            <p className="resource-status">Resources couldn’t be loaded. Please try again shortly.</p>
          ) : null}

          {state.status === "ready" && state.resources.length > 0 ? (
            <>
              <div className="resources-intro">
                <p>{state.resources.length} guides for making stronger photographs.</p>
                <div className="resource-categories" aria-label="Resource categories">
                  {categories.map((category) => <span key={category}>{category}</span>)}
                </div>
              </div>

              <div className="resources-grid">
                {state.resources.map((resource) => (
                  <article className="resource-card" key={resource.slug}>
                    <Link className="resource-card-link" to={`/resources/${resource.slug}`}>
                      <div className="resource-card-image-wrap">
                        <img
                          className="resource-card-image"
                          src={resource.image}
                          alt={resource.imageAlt || ""}
                        />
                      </div>
                      <div className="resource-card-copy">
                        <div className="resource-card-meta">
                          <span>{resource.category}</span>
                          <span>{resource.readTime}</span>
                        </div>
                        <h2>{resource.title}</h2>
                        <p>{resource.excerpt}</p>
                        <span className="resource-card-action">Read guide <span aria-hidden="true">→</span></span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
      ) : null}
    </SiteLayout>
  );
}
