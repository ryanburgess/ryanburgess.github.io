import { useEffect, useMemo, useRef, useState } from "react";
import SiteLayout from "../layout/SiteLayout";
import {
  approvedPhotographyResources,
  fetchPhotographyResources,
  findApprovedDuplicate,
  photographyResourceCategories,
  validatePhotographyResource,
} from "../lib/photographyResources";

const emptyForm = { category: "", title: "", url: "", notes: "", website: "" };

function TurnstileChallenge({ onToken }) {
  const containerRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;
    let active = true;
    let widgetId;

    const render = () => {
      if (!active || !containerRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };

    const existing = document.querySelector('script[data-photography-turnstile="true"]');
    if (window.turnstile) render();
    else if (existing) existing.addEventListener("load", render, { once: true });
    else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.photographyTurnstile = "true";
      script.addEventListener("load", render, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      existing?.removeEventListener("load", render);
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;
  return <div className="photography-turnstile" ref={containerRef} aria-label="Anti-spam verification" />;
}

function ResourceLinkCard({ resource, categoryLabel }) {
  return (
    <article className="photography-link-card">
      <div className="photography-link-meta">
        <span className="photography-category-badge" data-category={resource.category}>{categoryLabel}</span>
      </div>
      <h2>{resource.title}</h2>
      {resource.notes ? <p>{resource.notes}</p> : null}
      <a href={resource.url} target="_blank" rel="noopener noreferrer">
        Visit resource <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default function PhotographyResources() {
  const [resourceCollection, setResourceCollection] = useState({
    categories: photographyResourceCategories,
    resources: approvedPhotographyResources,
  });
  const [resourceLoadStatus, setResourceLoadStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submission, setSubmission] = useState({ status: "idle", message: "", prUrl: "" });
  const notesWordCount = form.notes.trim() ? form.notes.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const controller = new AbortController();

    fetchPhotographyResources({ signal: controller.signal })
      .then((collection) => {
        setResourceCollection(collection);
        setResourceLoadStatus("live");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.warn("Using the bundled photography resource snapshot.", error);
        setResourceLoadStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  const { categories, resources } = resourceCollection;

  const categoryLabels = useMemo(
    () => Object.fromEntries(categories.map((item) => [item.id, item.label])),
    [categories]
  );

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = category === "all" || resource.category === category;
      const matchesSearch = !query || [resource.title, resource.notes, resource.url, categoryLabels[resource.category]]
        .some((value) => String(value || "").toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [category, categoryLabels, resources, search]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submission.status !== "idle") setSubmission({ status: "idle", message: "", prUrl: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = validatePhotographyResource(form, categories);
    const duplicate = findApprovedDuplicate(result.value.url, resources);

    if (!result.valid || duplicate) {
      setErrors({ ...result.errors, ...(duplicate ? { url: "This URL is already in the approved collection." } : {}) });
      return;
    }

    setErrors({});
    setSubmission({ status: "submitting", message: "Submitting for review…", prUrl: "" });

    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await fetch("/api/resources/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ ...result.value, website: form.website, turnstileToken }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (body.errors) setErrors(body.errors);
        throw new Error(body.message || "The submission could not be sent. Please try again.");
      }

      setForm(emptyForm);
      setSubmission({
        status: "success",
        message: "Thanks—your resource is awaiting review. Ryan usually reviews submissions within 24 hours, and approved links appear after the pull request is merged.",
        prUrl: body.prUrl || "",
      });
    } catch (error) {
      setSubmission({ status: "error", message: error.message, prUrl: "" });
    }
  };

  return (
    <SiteLayout>
      <section className="page-hero photography-resources-hero">
        <div className="page-hero-inner">
          <span className="resource-eyebrow">Community collection</span>
          <h1>Photography Resources</h1>
          <p>Useful tools, references, and learning materials for photographers.</p>
          <a className="photography-resources-cta" href="#contribute-resources">Contribute resources</a>
        </div>
      </section>

      <section className="photography-library" aria-label="Photography resource collection">
        <div className="photography-library-inner">
          <div className="photography-resource-summary">
            <span className="photography-resource-count">
              {filteredResources.length} {filteredResources.length === 1 ? "resource" : "resources"}
            </span>
          </div>

          {resourceLoadStatus === "fallback" ? (
            <p className="photography-resource-sync-status" role="status">
              Live updates are temporarily unavailable. Showing the most recently saved collection.
            </p>
          ) : null}

          <div className="photography-resource-tools" role="search">
            <div className="photography-resource-field">
              <label htmlFor="resource-search">Search</label>
              <input
                id="resource-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles, notes, or websites"
              />
            </div>
            <div className="photography-resource-field">
              <label htmlFor="resource-category-filter">Category</label>
              <select id="resource-category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredResources.length ? (
            <div className="photography-link-grid">
              {filteredResources.map((resource) => (
                <ResourceLinkCard
                  resource={resource}
                  categoryLabel={categoryLabels[resource.category] || resource.category}
                  key={resource.id}
                />
              ))}
            </div>
          ) : (
            <div className="photography-resource-empty">
              <span aria-hidden="true">◎</span>
              <h3>{resources.length ? "No matching resources" : "The collection is just getting started"}</h3>
              <p>
                {resources.length
                  ? "Try a different search or category."
                  : "Approved resources will appear here as they are added. Know a useful one? Submit the first recommendation below."}
              </p>
              {resources.length ? (
                <button type="button" onClick={() => { setSearch(""); setCategory("all"); }}>Clear filters</button>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <section id="contribute-resources" className="photography-submit-section" aria-labelledby="submit-resource-title">
        <div className="photography-submit-inner">
          <div className="photography-submit-copy">
            <span className="resource-eyebrow">Share something useful</span>
            <h2 id="submit-resource-title">Suggest a resource</h2>
            <p>
              Submit a link for review. Ryan usually reviews submissions within 24 hours. Approved resources appear in the collection only after the public pull request is merged.
            </p>
            <p className="photography-submit-disclosure">
              Your title, URL, and notes will be visible publicly in GitHub during review. Do not include private information.
            </p>
          </div>

          <form className="photography-submit-form" onSubmit={handleSubmit} noValidate>
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="resource-website">Website</label>
              <input id="resource-website" name="website" value={form.website} onChange={updateField("website")} tabIndex="-1" autoComplete="off" />
            </div>

            <div className="field">
              <label htmlFor="resource-category">Category <span aria-hidden="true">*</span></label>
              <select id="resource-category" value={form.category} onChange={updateField("category")} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "resource-category-error" : undefined}>
                <option value="">Choose a category</option>
                {categories.map((item) => (
                  <option value={item.id} key={item.id}>{item.label}</option>
                ))}
              </select>
              {errors.category ? <span className="field-error" id="resource-category-error">{errors.category}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="resource-title">Title <span aria-hidden="true">*</span></label>
              <input id="resource-title" value={form.title} onChange={updateField("title")} maxLength="120" placeholder="Resource name" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "resource-title-error" : undefined} />
              {errors.title ? <span className="field-error" id="resource-title-error">{errors.title}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="resource-url">URL <span aria-hidden="true">*</span></label>
              <input id="resource-url" type="url" inputMode="url" value={form.url} onChange={updateField("url")} maxLength="2048" placeholder="https://example.com/resource" aria-invalid={Boolean(errors.url)} aria-describedby={errors.url ? "resource-url-error" : undefined} />
              {errors.url ? <span className="field-error" id="resource-url-error">{errors.url}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="resource-notes">Why do you recommend it? <span aria-hidden="true">*</span></label>
              <textarea id="resource-notes" value={form.notes} onChange={updateField("notes")} minLength="5" maxLength="500" required placeholder="Write at least 5 words about why this resource is useful" aria-invalid={Boolean(errors.notes)} aria-describedby="resource-notes-help" />
              <div className="field-help-row" id="resource-notes-help">
                <span className={errors.notes ? "field-error" : undefined}>{errors.notes || "At least 5 words are required. Please avoid firsthand claims unless they are your own."}</span>
                <span>{notesWordCount} words · {form.notes.length}/500</span>
              </div>
            </div>

            <TurnstileChallenge onToken={setTurnstileToken} />

            <button type="submit" disabled={submission.status === "submitting"}>
              {submission.status === "submitting" ? "Submitting…" : "Submit for review"}
            </button>

            {submission.status !== "idle" && submission.status !== "submitting" ? (
              <div className={`photography-submit-status is-${submission.status}`} role={submission.status === "error" ? "alert" : "status"}>
                <p>{submission.message}</p>
                {submission.prUrl ? <a href={submission.prUrl} target="_blank" rel="noopener noreferrer">View the pull request ↗</a> : null}
              </div>
            ) : null}
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
