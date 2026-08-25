import { useEffect } from "react";
import SiteLayout from "../layout/SiteLayout";

const assetPath = "/guides/color-cheat-sheet/ryan-burgess-color-exposure-cheat-sheet.jpg";

export default function ColorExposureCheatSheet() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Color Exposure Cheat Sheet | Ryan Burgess Photography";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <SiteLayout showNewsletter={false}>
      <article className="guide-download-page">
        <div className="guide-download-inner">
          <div className="guide-download-copy">
            <span className="guide-download-kicker">Free photography guide</span>
            <h1>Color Exposure Cheat Sheet</h1>
            <p className="guide-download-lede">
              A quick field reference for adjusting exposure when different colors fill your frame.
              Save it to your phone and keep it close while you shoot.
            </p>

            <a
              className="btn btn-primary guide-download-button"
              href={assetPath}
              download="ryan-burgess-color-exposure-cheat-sheet.jpg"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
              </svg>
              Download free guide
            </a>

            <p className="guide-download-note">Free JPEG · 941 × 1700 pixels · No signup required</p>

            <div className="guide-download-details">
              <h2>A simple reference for tricky color</h2>
              <p>
                Camera meters try to render every scene near middle gray. Very light, dark, or vivid
                subjects can throw that reading off. This guide gives you a practical starting point
                for exposure compensation across common colors and tones.
              </p>
              <ul>
                <li>Quick exposure adjustments from white through black</li>
                <li>Starting points for vivid colors and skin tones</li>
                <li>A phone-friendly format for use in the field</li>
              </ul>
            </div>
          </div>

          <figure className="guide-download-preview">
            <div className="guide-download-image-wrap">
              <img
                src={assetPath}
                alt="Ryan Burgess Color Exposure Cheat Sheet showing suggested exposure adjustments for different colors"
              />
            </div>
            <figcaption>Preview of the full downloadable cheat sheet</figcaption>
          </figure>
        </div>
      </article>
    </SiteLayout>
  );
}
