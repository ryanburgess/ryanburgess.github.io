import { Link } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";

export default function ContactThanks() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Message sent</h1>
          <p>Thanks for reaching out — I’ll be in touch soon.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-inner" style={{ textAlign: "center" }}>
          <p style={{ maxWidth: 520, margin: "0 auto 28px", opacity: 0.8 }}>
            Your message was successfully submitted. I usually reply within
            1–2 days.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link className="btn btn-primary" to="/portfolio">
              View Portfolio
            </Link>
            <Link className="btn btn-ghost" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}