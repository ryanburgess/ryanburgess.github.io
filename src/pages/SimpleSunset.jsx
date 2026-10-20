import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import SiteLayout from "../layout/SiteLayout";

const appStoreUrl = "https://apps.apple.com/app/id6820611102";

export default function SimpleSunset() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Simple Sunset for iOS | Ryan Burgess Photography";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <SiteLayout showNewsletter={false}>
      <article className="guide-download-page sunset-app-page">
        <div className="guide-download-inner">
          <div className="guide-download-copy">
            <span className="guide-download-kicker">A little help chasing the light</span>
            <PageHeading><h1>Simple Sunset</h1></PageHeading>
            <p className="guide-download-lede">
              Know when to grab your camera. Sunrise and sunset predictions, weather,
              and photography forecasts come together in one simple iOS app.
            </p>
            <a className="app-store-badge" href={appStoreUrl} aria-label="Download Simple Sunset on the App Store">
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                alt="Download on the App Store"
                width="180"
                height="60"
              />
            </a>
            <p className="sunset-availability">Coming soon to the App Store. The download link will work once the app is published.</p>
            <div className="guide-download-details">
              <h2>Make more of the light</h2>
              <p>
                Plan your next photo walk with a clearer picture of the conditions ahead.
                Choose a supported city and see what the sky might have in store.
              </p>
              <ul>
                <li>Sunrise and sunset predictions to help plan your shoot</li>
                <li>Photography forecasts for soft light, dramatic skies, and moody streets</li>
                <li>Optional alerts for promising sunrise and sunset conditions</li>
                <li>Prediction history to look back at recent conditions</li>
              </ul>
            </div>
            <nav className="sunset-app-links" aria-label="Simple Sunset information">
              <Link to="/simple-sunset/privacy">Privacy policy</Link>
              <Link to="/simple-sunset/terms">Terms of use</Link>
              <Link to="/contact">App support</Link>
            </nav>
          </div>
          <figure className="guide-download-preview sunset-app-preview">
            <div className="sunset-icon-stage">
              <img src="/images/apps/simple-sunset/icon.png" alt="Simple Sunset app icon: a purple setting sun with a golden arrow and horizon" width="1024" height="1024" />
            </div>
            <figcaption>Simple Sunset · Sunrise, sunset, and photography forecasts</figcaption>
          </figure>
        </div>
        <p className="sunset-trademark">Apple, the Apple logo, iPhone, and App Store are trademarks of Apple Inc., registered in the U.S. and other countries.</p>
      </article>
    </SiteLayout>
  );
}
