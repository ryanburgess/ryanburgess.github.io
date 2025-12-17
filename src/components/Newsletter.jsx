const BUTTONDOWN_ACTION = "https://buttondown.com/api/emails/embed-subscribe/ryanburgess";

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <h2>Get notified about new releases</h2>
        <p>Be the first to know when new magazines and print editions go live.</p>

        <form action={BUTTONDOWN_ACTION} method="post" className="newsletter-form">
          <label className="sr-only" htmlFor="bd-email">
            Email address
          </label>
          <input type="email" name="email" id="bd-email" placeholder="Email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}