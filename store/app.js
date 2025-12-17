// Store SPA (no-build). Uses UMD globals provided by store/index.html.
const React = window.React;
const ReactDOM = window.ReactDOM;
const {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} = window.ReactRouterDOM;

const { useEffect, useMemo, useState } = React;
const { createRoot } = ReactDOM;

const STORE_BASENAME = "/store";
const PRODUCTS_JSON_URL = "/products.json";
const IG_URL = "https://www.instagram.com/ryan.burgess";
const BUTTONDOWN_ACTION = "https://buttondown.com/api/emails/embed-subscribe/ryanburgess";

function formatMoney(amount, currency = "USD") {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function productTypeToCategory(type) {
  if (type === "magazine") return "magazines";
  if (type === "print") return "prints";
  return type || "";
}

function byTitle(a, b) {
  return (a.title || "").localeCompare(b.title || "");
}

function getPriceFrom(product) {
  if (product.priceFrom != null) return product.priceFrom;
  const variants = product.variants || [];
  const prices = variants.map((v) => v.price).filter((p) => p != null);
  return prices.length ? Math.min(...prices) : null;
}

function getDefaultVariant(product) {
  const variants = product.variants || [];
  return variants[0] || null;
}

function buildProductPath(product) {
  return `/products/${product.slug || product.id || ""}`;
}

// Featured selection
function sortFeatured(a, b) {
  const ao = a.featuredOrder ?? 9999;
  const bo = b.featuredOrder ?? 9999;
  return ao - bo || (a.title || "").localeCompare(b.title || "");
}

function pickFeatured(products, category, fallbackCount) {
  const inCategory = products.filter((p) => productTypeToCategory(p.type) === category);

  const featured = inCategory
    .filter((p) => p.featured === true)
    .slice()
    .sort(sortFeatured);

  if (featured.length) return featured;
  return inCategory.slice(0, fallbackCount);
}

function useProducts() {
  const [state, setState] = useState({
    status: "loading",
    products: [],
    categories: [],
    error: null,
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(PRODUCTS_JSON_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load products.json (${res.status})`);
        const data = await res.json();

        const products = (data.products || []).slice().sort(byTitle);
        const categories = data.categories || [];

        if (!alive) return;
        setState({ status: "ready", products, categories, error: null });
      } catch (err) {
        if (!alive) return;
        setState({ status: "error", products: [], categories: [], error: err });
      }
    })();

    return () => { alive = false; };
  }, []);

  return state;
}

function Header() {
  return (
    <header className="site-header">
      <div className="logo">
        <a href="/" className="logo-link">
          <span className="logo-main">Ryan Burgess</span>
          <span className="logo-sub">Photography</span>
        </a>
      </div>

      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-toggle-label"><span></span></label>

      <nav className="site-nav">
        <a href="/portfolio/">Portfolio</a>
        <a href="/store/">Store</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </nav>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <span>&copy; {year} Ryan Burgess Photography</span>
      </div>
      <div className="footer-right">
        <a href="/store/">Store</a>
        <a href="/portfolio/">Portfolio</a>
        <a href="/contact/">Contact</a>
        <a href={IG_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
}

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <h2>Get notified about new releases</h2>
        <p>Be the first to know when new magazines and print editions go live.</p>
        <form action={BUTTONDOWN_ACTION} method="post" className="newsletter-form">
          <label className="sr-only" htmlFor="bd-email">Email address</label>
          <input type="email" name="email" id="bd-email" placeholder="Email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function AppShell({ children }) {
  return (
    <>
      <Header />
      <main className="store-page">
        {children}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

function PageHero({ title, subtitle, rightLink }) {
  return (
    <section className="page-hero page-hero--store">
      <div className="page-hero-inner" style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {rightLink ? (
          <Link className="store-section-link" to={rightLink.to}>
            {rightLink.label} &rarr;
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((p) => <ProductCard key={p.id || p.slug} product={p} />)}
    </div>
  );
}

function ProductCard({ product }) {
  const priceFrom = getPriceFrom(product);
  const category = productTypeToCategory(product.type);
  const to = buildProductPath(product);
  const image = (product.images && product.images[0]) ? product.images[0] : "";

  return (
    <article className="product-card">
      <Link to={to} className="product-card-link" aria-label={`View ${product.title}`}>
        <div className="product-media">
          <div
            className={`product-image ${category === "magazines" ? "product-image--magazine" : ""}`}
            style={{ backgroundImage: image ? `url(${image})` : "none" }}
          />
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-meta">
            {category === "magazines" ? "Magazine" : "Print"}
            {priceFrom != null ? ` · From ${formatMoney(priceFrom, product.currency || "USD")}` : ""}
          </p>
          <p className="product-description">{product.shortDescription || ""}</p>

          <div className="product-actions">
            <span className={`btn ${category === "magazines" ? "btn-primary" : "btn-ghost"} btn-sm`}>View Details</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function StoreHome({ products }) {
  const magazines = useMemo(() => pickFeatured(products, "magazines", 4), [products]);
  const prints = useMemo(() => pickFeatured(products, "prints", 6), [products]);

  return (
    <AppShell>
      <PageHero title="Store" subtitle="Magazines and prints featuring color-rich San Francisco and beyond." />

      <section className="store-section store-section--magazines">
        <div className="store-section-header">
          <div>
            <h2>Magazines</h2>
            <p>Photographic stories in print – limited runs and evolving series.</p>
          </div>
          <Link to="/magazines" className="store-section-link">View all Magazines</Link>
        </div>
        <ProductGrid products={magazines} />
      </section>

      <section className="store-section store-section--prints">
        <div className="store-section-header">
          <div>
            <h2>Prints</h2>
            <p>Selected images available as high-quality prints.</p>
          </div>
          <Link to="/prints" className="store-section-link">View all Prints</Link>
        </div>
        <ProductGrid products={prints} />
      </section>
    </AppShell>
  );
}

function CatalogPage({ products, category }) {
  const title = category === "magazines" ? "Magazines" : "Prints";
  const subtitle = category === "magazines"
    ? "All photography magazines available now (and what’s coming next)."
    : "Selected images available as high-quality prints.";

  const filtered = useMemo(
    () => products.filter((p) => productTypeToCategory(p.type) === category),
    [products, category]
  );

  return (
    <AppShell>
      <PageHero title={title} subtitle={subtitle} rightLink={{ label: "Back to Store", to: "/" }} />
      <section className="store-section">
        <div className="store-section-header">
          <div>
            <h2>{title}</h2>
            <p>{category === "magazines" ? "Browse all magazines." : "Browse all prints."}</p>
          </div>
        </div>
        <ProductGrid products={filtered} />
      </section>
    </AppShell>
  );
}

function ProductPage({ products }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = useMemo(
    () => products.find((p) => p.slug === slug || p.id === slug),
    [products, slug]
  );

  if (!product) {
    return (
      <AppShell>
        <PageHero title="Not found" subtitle="That product doesn’t exist." rightLink={{ label: "Back to Store", to: "/" }} />
        <section className="store-section">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate(-1)}>Go back</button>
        </section>
      </AppShell>
    );
  }

  const category = productTypeToCategory(product.type);

  return (
    <AppShell>
      <PageHero
        title={product.title}
        subtitle={category === "magazines" ? "Magazine" : "Print"}
        rightLink={{
          label: category === "magazines" ? "All Magazines" : "All Prints",
          to: category === "magazines" ? "/magazines" : "/prints",
        }}
      />
      <section className="store-section">
        <div className="store-section-header">
          <div>
            <h2>{product.title}</h2>
            <p>{product.longDescription || product.shortDescription || ""}</p>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.75)" }}>
          Next step: we’ll add carousel + size dropdown + Buy button here (same as earlier plan).
        </p>
        <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Back</button>
      </section>
    </AppShell>
  );
}

function StoreApp() {
  const { status, products, error } = useProducts();

  if (status === "loading") return <div className="store-page"><Header /><Loading /></div>;
  if (status === "error") return <AppShell><p style={{ padding: 24 }}>Error: {String(error)}</p></AppShell>;

  return (
    <BrowserRouter basename={STORE_BASENAME}>
      <Routes>
        <Route path="/" element={<StoreHome products={products} />} />
        <Route path="/magazines" element={<CatalogPage products={products} category="magazines" />} />
        <Route path="/prints" element={<CatalogPage products={products} category="prints" />} />
        <Route path="/products/:slug" element={<ProductPage products={products} />} />
      </Routes>
    </BrowserRouter>
  );
}

// Tiny loading component to avoid extra code above
function Loading() {
  return <div style={{ padding: 24, color: "rgba(255,255,255,0.75)" }}>Loading products…</div>;
}

createRoot(document.getElementById("store-root")).render(<StoreApp />);