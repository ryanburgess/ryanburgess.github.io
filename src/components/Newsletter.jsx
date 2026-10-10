import { useState } from "react";

export default function Newsletter() {
  const [submission, setSubmission] = useState({ status: "idle", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmission({ status: "submitting", message: "Saving your email…" });

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) throw new Error("Your email could not be saved. Please try again.");

      form.reset();
      setSubmission({
        status: "success",
        message: "Thanks! Your email has been added to the list.",
      });
    } catch (error) {
      setSubmission({
        status: "error",
        message: error.message || "Your email could not be saved. Please try again.",
      });
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <h2>Get notified about new releases</h2>
        <p>Be the first to know when new magazines and print editions go live.</p>

        <form
          name="newsletter"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="newsletter-form"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="sr-only">
            <label>
              Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
          </p>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input type="email" name="email" id="newsletter-email" placeholder="Email address" required />
          <button type="submit" disabled={submission.status === "submitting"}>
            {submission.status === "submitting" ? "Saving…" : "Subscribe"}
          </button>
        </form>

        {submission.message ? (
          <p className={`newsletter-status is-${submission.status}`} role="status">
            {submission.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
