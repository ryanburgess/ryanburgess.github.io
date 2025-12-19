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
          <div className="contact-grid">
            <div className="contact-copy">
              <p>
                For inquiries, collaborations, licensing, or print questions — send a note.
              </p>
              <p>
                Or email directly: <a href="mailto:ryan@ryanburgess.com">ryan@ryanburgess.com</a>
              </p>
              <p className="muted" style={{ marginTop: 18 }}>
                Typical reply time: 1–2 days.
              </p>
            </div>

            <form
              className="contact-form"
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              action="/contact/thanks"
            >
              {/* Netlify required hidden field */}
              <input type="hidden" name="form-name" value="contact" />

              {/* Honeypot field */}
              <p className="sr-only">
                <label>
                  Don’t fill this out if you’re human: <input name="bot-field" />
                </label>
              </p>

              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>

              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" placeholder="What’s this about?" />
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Write your message…" required />
              </div>

              <button type="submit">Send message</button>

              <p className="muted" style={{ marginTop: 10, fontSize: 13 }}>
                This form is protected with spam filtering.
              </p>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}