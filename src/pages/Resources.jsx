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
          <p>Practical field notes, creative prompts, and photography guides from behind the lens.</p>
        </div>
      </section>

      <section className="resources-section" aria-live="polite">
        <div className="resources-inner">
          {state.status === "loading" ? <p className="resource-status">Loading resources…</p> : null}

          {state.status === "error" ? (
            <p className="resource-status">Resources couldn’t be loaded. Please try again shortly.</p>
          ) : null}

          {state.status === "ready" && state.resources.length === 0 ? (
            <p className="resource-status">New photography resources are coming soon.</p>
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
    </SiteLayout>
  );
}
