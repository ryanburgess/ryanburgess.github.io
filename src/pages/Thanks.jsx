import { Link } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";

export default function Thanks() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Thanks</h1>
          <p>Your message has been sent.</p>
        </div>
      </section>

      <section className="page-content">
        <div
          className="content-inner"
          style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}
        >
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>
            I’ve received your message and will get back to you as soon as I can.
            Typical reply time is 1–2 days.
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>

            <Link to="/portfolio" className="btn btn-ghost">
              View portfolio
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}