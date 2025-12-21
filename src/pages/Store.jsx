import SiteLayout from "../layout/SiteLayout";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, categoryFromType } from "../lib/products";

function formatMoney(amount, currency = "USD") {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function ProductCard({ product }) {
  const image = product.images?.[0] || "";
  const category = categoryFromType(product.type);
  const priceFrom = product.priceFrom ?? product.variants?.[0]?.price;

  return (
    <article className="product-card">
      <div
        className={`product-image ${category === "magazines" ? "product-image--magazine" : ""}`}
        style={{ backgroundImage: `url(${image})` }}
        aria-label={product.title}
        role="img"
      />

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

        <p className="product-meta">
          {category === "magazines" ? "Magazine" : "Print"}
          {priceFrom != null ? ` · From ${formatMoney(priceFrom, product.currency || "USD")}` : ""}
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

export default function Store() {
  const [data, setData] = useState({ status: "loading", categories: [], products: [], error: null });

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((json) => {
        if (!alive) return;
        setData({ status: "ready", categories: json.categories || [], products: json.products || [], error: null });
      })
      .catch((err) => {
        if (!alive) return;
        setData({ status: "error", categories: [], products: [], error: err });
      });
    return () => {
      alive = false;
    };
  }, []);

  const magazines = useMemo(
    () => data.products.filter((p) => categoryFromType(p.type) === "magazines"),
    [data.products]
  );
  const prints = useMemo(
    () => data.products.filter((p) => categoryFromType(p.type) === "prints"),
    [data.products]
  );

  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Store</h1>
          <p>Magazines and prints featuring color-rich San Francisco.</p>
        </div>
      </section>

      {data.status === "loading" ? (
        <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>Loading…</div>
      ) : null}

      {data.status === "error" ? (
        <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          Couldn’t load products. {String(data.error?.message || data.error)}
        </div>
      ) : null}

      {data.status === "ready" ? (
        <>
          <section className="store-section">
            <div className="store-section-header">
              <div>
                <h2>Magazines</h2>
                <p>Photographic stories in print – limited runs and evolving series.</p>
              </div>

              {/* If you want these later as internal pages */}
              <Link className="store-section-link" to="/store/magazines">
                View all Magazines →
                </Link>
            </div>

            <div className="product-grid">
              {magazines.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section className="store-section">
            <div className="store-section-header">
              <div>
                <h2>Prints</h2>
                <p>Selected images available as high-quality prints.</p>
              </div>

              <Link className="store-section-link" to="/store/prints">
                View all Prints →
              </Link>
            </div>

            <div className="product-grid">
              {prints.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </SiteLayout>
  );
}