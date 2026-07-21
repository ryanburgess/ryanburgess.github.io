import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import { fetchResources } from "../lib/resources";

export default function ResourceDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", resources: [] });

  useEffect(() => {
    let alive = true;

    fetchResources()
      .then((data) => {
        if (alive) setState({ status: "ready", resources: data.resources || [] });
      })
      .catch(() => {
        if (alive) setState({ status: "error", resources: [] });
      });

    return () => {
      alive = false;
    };
  }, []);

  const resource = useMemo(
    () => state.resources.find((item) => item.slug === slug),
    [slug, state.resources]
  );

  const related = useMemo(() => {
    if (!resource) return [];
    return state.resources
      .filter((item) => item.slug !== resource.slug && item.category === resource.category)
      .slice(0, 2);
  }, [resource, state.resources]);

  if (state.status === "loading") {
    return <SiteLayout><div className="resource-status resource-status--page">Loading resource…</div></SiteLayout>;
  }

  if (state.status === "error") {
    return <SiteLayout><div className="resource-status resource-status--page">This resource couldn’t be loaded.</div></SiteLayout>;
  }

  if (!resource) {
    return (
      <SiteLayout>
        <section className="resource-not-found">
          <span className="resource-eyebrow">404</span>
          <h1>Resource not found</h1>
          <p>The guide may have moved or is no longer available.</p>
          <Link className="btn btn-primary" to="/resources">Browse resources</Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="resource-detail">
        <header className="resource-detail-header">
          <Link className="resource-back" to="/resources">← All resources</Link>
          <div className="resource-detail-meta">
            <span>{resource.category}</span>
            <span>{resource.readTime}</span>
          </div>
          <h1>{resource.title}</h1>
          <p className="resource-deck">{resource.excerpt}</p>
        </header>

        <figure className="resource-feature">
          <img src={resource.image} alt={resource.imageAlt || ""} />
          {resource.imageCaption ? <figcaption>{resource.imageCaption}</figcaption> : null}
        </figure>

        <div className="resource-body">
          {resource.introduction?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

          {resource.sections?.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points?.length ? (
                <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>
              ) : null}
            </section>
          ))}

          {resource.takeaways?.length ? (
            <aside className="resource-takeaways">
              <h2>In your camera bag</h2>
              <ul>{resource.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
          ) : null}
        </div>

        {related.length ? (
          <section className="resource-related">
            <h2>Keep exploring</h2>
            <div>
              {related.map((item) => (
                <Link key={item.slug} to={`/resources/${item.slug}`}>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </SiteLayout>
  );
}
