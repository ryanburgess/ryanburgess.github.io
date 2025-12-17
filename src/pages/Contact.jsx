import SiteLayout from "../layout/SiteLayout";

export default function Contact() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Contact</h1>
          <p>For inquiries, collaborations, or print questions.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-inner">
          <p>
            Email:{" "}
            <a href="mailto:ryan@ryanburgess.com">ryan@ryanburgess.com</a>
          </p>

          <p style={{ opacity: 0.75 }}>
            (We’ll add a real form with a service like Netlify Forms next.)
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}