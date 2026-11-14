import PageHeading from "../components/PageHeading";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import { fetchResources } from "../lib/resources";

function ResourceBlocks({ blocks }) {
  return blocks?.map((block) =>
    typeof block === "string" ? (
      <p key={block}>{block}</p>
    ) : (
      <ul key={block.points[0]}>{block.points.map((point) => <li key={point}>{point}</li>)}</ul>
    )
  );
}

function ResourceLink({ link }) {
  if (!link) return null;
  const { href, label, description } = link;
  return (
    <p>
      {description ? <>{description} </> : null}
      {href.startsWith("#") || href.startsWith("https://") || href.startsWith("http://") ? (
        <a href={href}>{label}</a>
      ) : (
        <Link to={href}>{label}</Link>
      )}
    </p>
  );
}

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

  useEffect(() => {
    if (!resource) return;
    const previousTitle = document.title;
    document.title = `${resource.title} | Ryan Burgess Photography`;
    return () => { document.title = previousTitle; };
  }, [resource]);

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
          <PageHeading><h1>Resource not found</h1></PageHeading>
          <p>The guide may have moved or is no longer available.</p>
          <Link className="btn btn-primary" to="/resources">Browse resources</Link>
        </section>
      </SiteLayout>
    );
  }

  const jumpLinks = resource.sections?.filter((section) => section.id && section.jumpLabel);

  return (
    <SiteLayout>
      <article className="resource-detail">
        <header className="resource-detail-header">
          <Link className="resource-back" to="/resources">← All resources</Link>
          <div className="resource-detail-meta">
            <span>{resource.category}</span>
            <span>{resource.readTime}</span>
          </div>
          <PageHeading><h1>{resource.title}</h1></PageHeading>
          <p className="resource-deck">{resource.excerpt}</p>
        </header>

        {resource.image ? (
          <figure className="resource-feature">
            <img src={resource.image} alt={resource.imageAlt || ""} />
            {resource.imageCaption ? <figcaption>{resource.imageCaption}</figcaption> : null}
          </figure>
        ) : null}

        <div className="resource-body">
          {resource.introduction?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

          {jumpLinks?.length ? (
            <nav className="resource-jump-links" aria-label="On this page">
              <strong>On this page</strong>
              {jumpLinks.map(({ id, jumpLabel }) => <a key={id} href={`#${id}`}>{jumpLabel}</a>)}
            </nav>
          ) : null}

          {resource.sections?.map((section) => (
            <section key={section.heading} id={section.id}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <ResourceBlocks blocks={section.blocks} />
              {section.points?.length ? (
                <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>
              ) : null}
              {section.subsections?.map(({ heading, blocks, link }) => (
                <section className="resource-subsection" key={heading}>
                  <h3>{heading}</h3>
                  <ResourceBlocks blocks={blocks} />
                  <ResourceLink link={link} />
                </section>
              ))}
              {section.image ? (
                <figure className="resource-inline-photo">
                  <img src={section.image} alt={section.imageAlt || ""} loading="lazy" />
                  {section.imageCaption ? <figcaption>{section.imageCaption}</figcaption> : null}
                </figure>
              ) : null}
              <ResourceLink link={section.link} />
            </section>
          ))}

          {resource.takeaways?.length ? (
            <aside className="resource-takeaways">
              <h2>In your camera bag</h2>
              <ul>{resource.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
          ) : null}

          {resource.callout ? (
            <aside className="resource-takeaways">
              <h2>{resource.callout.heading}</h2>
              <p>{resource.callout.description}</p>
              <Link className="btn btn-primary" to={resource.callout.href}>{resource.callout.label}</Link>
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
