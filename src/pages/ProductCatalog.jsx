import SiteLayout from "../layout/SiteLayout";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProducts } from "../lib/products";

function categoryToType(category) {
  // URL param will be "magazines" or "prints"
  if (category === "magazines") return "magazine";
  if (category === "prints") return "print";
  return null;
}

function formatMoney(amount, currency = "USD") {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function ProductCard({ product }) {
  const image = product.images?.[0] || "";
  const priceFrom = product.priceFrom ?? product.variants?.[0]?.price;

  return (
    <article className="product-card">
      <div
        className={`product-image ${product.type === "magazine" ? "product-image--magazine" : ""}`}
        style={{ backgroundImage: `url(${image})` }}
        aria-label={product.title}
        role="img"
      />

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

        <p className="product-meta">
          {priceFrom != null ? `From ${formatMoney(priceFrom, product.currency || "USD")}` : ""}
        </p>

        {product.shortDescription ? (
          <p className="product-description">{product.shortDescription}</p>
        ) : null}

        <div className="product-actions">
          <Link className="btn btn-primary btn-sm" to={`/store/products/${product.slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProductCatalog() {
  const { category } = useParams(); // "magazines" | "prints"
  const type = categoryToType(category);

  const [state, setState] = useState({ status: "loading", products: [], error: null });

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((json) => {
        if (!alive) return;
        setState({ status: "ready", products: json.products || [], error: null });
      })
      .catch((err) => {
        if (!alive) return;
        setState({ status: "error", products: [], error: err });
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!type) return [];
    return state.products.filter((p) => p.type === type);
  }, [state.products, type]);

  const title = category === "magazines" ? "Magazines" : "Prints";
  const subtitle =
    category === "magazines"
      ? "All magazines available now (and what’s coming next)."
      : "All prints currently available.";

  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="store-section">
        <div style={{ maxWidth: 960, margin: "0 auto 16px" }}>
          <Link className="store-section-link" to="/store">
            ← Back to Store
          </Link>
        </div>

        {state.status === "loading" ? (
          <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
            Loading…
          </div>
        ) : null}

        {state.status === "error" ? (
          <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
            Couldn’t load products. {String(state.error?.message || state.error)}
          </div>
        ) : null}

        {state.status === "ready" ? (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
}