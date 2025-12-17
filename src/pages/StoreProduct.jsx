import SiteLayout from "../layout/SiteLayout";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProducts } from "../lib/products";

function formatMoney(amount, currency = "USD") {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default function StoreProduct() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", products: [], error: null });
  const [activeIdx, setActiveIdx] = useState(0);
  const [variantId, setVariantId] = useState("");

  useEffect(() => {
    let alive = true;
    fetchProducts()
      .then((json) => {
        if (!alive) return;
        const products = json.products || [];
        setState({ status: "ready", products, error: null });
      })
      .catch((err) => {
        if (!alive) return;
        setState({ status: "error", products: [], error: err });
      });

    return () => {
      alive = false;
    };
  }, []);

  const product = useMemo(() => {
    if (state.status !== "ready") return null;
    return state.products.find((p) => p.slug === slug || p.id === slug) || null;
  }, [state.status, state.products, slug]);

  useEffect(() => {
    if (!product) return;
    setActiveIdx(0);
    const firstVariant = product.variants?.[0];
    setVariantId(firstVariant?.id || "");
  }, [product]);

  const variants = product?.variants || [];
  const selectedVariant = variants.find((v) => v.id === variantId) || variants[0] || null;

  const images = product?.images?.length ? product.images : [];
  const activeImage = images[activeIdx] || images[0] || "";

  if (state.status === "loading") {
    return (
      <SiteLayout>
        <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (state.status === "error") {
    return (
      <SiteLayout>
        <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          Couldn’t load product. {String(state.error?.message || state.error)}
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
          Product not found. <Link to="/store">Back to Store</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>{product.title}</h1>
          <p>{product.shortDescription || ""}</p>
        </div>
      </section>

      <section className="store-section">
        <div className="product-layout">
          {/* Gallery */}
          <div>
            <div
              className="product-gallery-main"
              role="img"
              aria-label={product.title}
              style={{ backgroundImage: `url(${activeImage})` }}
            />
            {images.length > 1 ? (
              <div className="product-gallery-thumbs" aria-label="Product images">
                {images.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    className={`product-thumb ${idx === activeIdx ? "is-active" : ""}`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* Buy panel */}
          <div className="product-panel">
            <p className="product-meta" style={{ marginTop: 0 }}>
              SKU: {product.sku || "—"}
            </p>

            {selectedVariant?.price != null || product.priceFrom != null ? (
              <div className="product-price">
                {formatMoney(
                  selectedVariant?.price ?? product.priceFrom,
                  product.currency || "USD"
                )}
              </div>
            ) : null}

            {product.longDescription ? (
              <p className="product-description">{product.longDescription}</p>
            ) : null}

            {variants.length > 1 ? (
              <div className="variant-row">
                <label className="variant-label" htmlFor="variant">
                  Size / Option
                </label>
                <select
                  id="variant"
                  className="variant-select"
                  value={variantId}
                  onChange={(e) => setVariantId(e.target.value)}
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                      {v.price != null ? ` — ${formatMoney(v.price, product.currency || "USD")}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="product-buyrow">
              {selectedVariant?.buyUrl ? (
                <a
                className="btn btn-primary"
                href={selectedVariant.buyUrl}
                target="_blank"
                rel="noreferrer"
                >
                Buy now
                </a>
              ) : (
                <span className="btn is-disabled">Coming soon</span>
              )}

              <Link className="btn btn-ghost" to="/store">
                Back to Store
              </Link>
            </div>

            <div className="trust-row">
                <div className="trust-item">
                    <strong>Secure checkout</strong>
                    Encrypted payment & reliable fulfillment.
                </div>
                <div className="trust-item">
                    <strong>Quality first</strong>
                    Printed for rich color and sharp detail.
                </div>
                </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}