import { useEffect } from "react";
import SiteLayout from "../layout/SiteLayout";

const effectiveDate = "October 20, 2026";

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function LegalPage({ title, children }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Simple Sunset`;
    return () => { document.title = previousTitle; };
  }, [title]);

  return (
    <SiteLayout showNewsletter={false}>
      <section className="legal-hero"><div className="legal-container">
        <span className="legal-product-name">Simple Sunset</span>
        <h1>{title}</h1>
        <p>Effective date: {effectiveDate}</p>
      </div></section>
      <section className="legal-page"><article className="legal-container legal-content">{children}</article></section>
    </SiteLayout>
  );
}

function ContactDetails({ intro }) {
  return <><p>{intro}</p><address>
    Ryan Burgess<br />
    Email: <a href="mailto:support@ryanburgess.com">support@ryanburgess.com</a><br />
    Website: <a href="https://ryanburgess.com">ryanburgess.com</a>
  </address></>;
}

export function SimpleSunsetPrivacy() {
  return <LegalPage title="Privacy Policy">
    <p>Simple Sunset is a photography forecast application created by Ryan Burgess. This Privacy Policy explains how Simple Sunset handles information when you use the application.</p>

    <h2>Information Simple Sunset Handles</h2>
    <p>Simple Sunset does not require an account and does not collect your name, email address, payment information, contacts, photos, or advertising identifiers.</p>
    <p>The app does not contain third-party advertising, behavioral analytics, or tracking technology.</p>

    <h3>Location</h3>
    <p>If you grant location permission, Simple Sunset temporarily accesses your device’s location to determine which supported forecast city is closest to you.</p>
    <p>Your precise device location:</p>
    <ul>
      <li>Is processed on your device.</li><li>Is not stored by Ryan Burgess.</li>
      <li>Is not transmitted to Ryan Burgess.</li><li>Is not sold or used for advertising.</li>
    </ul>
    <p>After identifying the closest supported city, the app uses that city’s predefined coordinates when requesting weather information. These predefined city coordinates are not your precise device location.</p>
    <p>Location access is optional. You may deny permission and select a city manually. You can change location permission at any time in the iOS Settings application.</p>

    <h3>Notifications</h3>
    <p>If you grant notification permission and enable forecast alerts, Simple Sunset schedules local notifications on your device for qualifying sunrise or sunset predictions.</p>
    <p>Notification preferences and scheduled notifications remain on your device. Simple Sunset does not use a remote push-notification service and does not send notification information to Ryan Burgess.</p>
    <p>You can disable individual alerts in Simple Sunset or revoke notification permission in iOS Settings.</p>

    <h3>Preferences and Prediction History</h3>
    <p>Simple Sunset stores certain information locally on your device, including:</p>
    <ul>
      <li>Your selected and default city.</li><li>Display preferences.</li>
      <li>Notification preferences and score threshold.</li><li>Locally recorded sunrise and sunset prediction history.</li>
    </ul>
    <p>This information is used to provide the app’s features. It is not transmitted to Ryan Burgess.</p>
    <p>You can reset locally recorded history from the app’s Settings screen. Deleting the app also removes locally stored app data, subject to standard iOS backup and restoration behavior.</p>

    <h2>Third-Party Services</h2>
    <p>Simple Sunset retrieves forecast and weather information from third-party services.</p>
    <h3>Open-Meteo</h3>
    <p>The app sends the latitude and longitude of your selected supported city to Open-Meteo to retrieve current weather information. Open-Meteo may receive standard network information, including your IP address and request details, according to its own practices.</p>
    <p>Open-Meteo’s terms and privacy information are available at:</p>
    <p><ExternalLink href="https://open-meteo.com/en/terms">Open-Meteo Terms and Privacy</ExternalLink></p>
    <h3>GitHub</h3>
    <p>Sunrise and sunset prediction data is retrieved from a publicly hosted file on GitHub. GitHub may receive standard network information, such as your IP address and request metadata, under its own privacy policy.</p>
    <p>GitHub’s Privacy Statement is available at:</p>
    <p><ExternalLink href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</ExternalLink></p>
    <h3>Apple</h3>
    <p>Apple provides the operating-system services used for location permission, local notifications, application distribution, and related platform functionality. Apple handles information according to its own privacy policies.</p>
    <p>Apple’s Privacy Policy is available at:</p>
    <p><ExternalLink href="https://www.apple.com/legal/privacy/">Apple Privacy Policy</ExternalLink></p>

    <h2>Data Sharing and Sale</h2>
    <p>Ryan Burgess does not sell, rent, or share personal information collected through Simple Sunset for advertising or marketing purposes.</p>
    <p>Because Simple Sunset does not operate user accounts or a developer-controlled analytics service, Ryan Burgess does not maintain a server-side profile of app users.</p>

    <h2>Data Retention</h2>
    <p>App preferences and locally recorded prediction history remain on your device until you reset them, delete the app, or iOS removes the data.</p>
    <p>Third-party service providers may retain network request information according to their own policies and retention practices.</p>

    <h2>Security</h2>
    <p>Simple Sunset uses encrypted HTTPS connections when retrieving weather and prediction information. However, no method of electronic transmission or storage can be guaranteed to be completely secure.</p>

    <h2>Children’s Privacy</h2>
    <p>Simple Sunset is intended for a general audience and does not knowingly collect personal information from children.</p>

    <h2>Your Choices</h2>
    <p>You can:</p>
    <ul>
      <li>Use the app without granting location access.</li><li>Select a city manually.</li>
      <li>Disable sunrise or sunset notifications.</li><li>Change the notification score threshold.</li>
      <li>Revoke location or notification permission through iOS Settings.</li>
      <li>Reset locally recorded prediction history.</li><li>Delete the app and its locally stored data.</li>
    </ul>

    <h2>Changes to This Policy</h2>
    <p>This Privacy Policy may be updated as Simple Sunset changes. The effective date at the top of this page will be revised when material changes are made.</p>

    <h2>Contact</h2>
    <ContactDetails intro="If you have questions about this Privacy Policy or Simple Sunset’s privacy practices, contact Ryan Burgess through:" />
  </LegalPage>;
}

export function SimpleSunsetTerms() {
  return <LegalPage title="Terms of Use">
    <p>These Terms of Use govern your use of the Simple Sunset application. By downloading or using Simple Sunset, you agree to these Terms.</p>
    <p>Simple Sunset is created and operated by Ryan Burgess.</p>

    <h2>The Service</h2>
    <p>Simple Sunset provides sunrise, sunset, weather, prediction-score, historical-score, and photography-guidance information for supported locations.</p>
    <p>The application is currently provided free of charge. There are no subscriptions or in-app purchases in this version of the application.</p>

    <h2>Forecasts Are Guidance</h2>
    <p>All predictions, weather information, photography scores, suggested shooting windows, and related recommendations are provided for general informational and creative-planning purposes only.</p>
    <p>Forecasts can be incomplete, delayed, inaccurate, or affected by changing conditions. Simple Sunset does not guarantee:</p>
    <ul>
      <li>Weather conditions.</li><li>Visibility or lighting conditions.</li><li>Sunrise or sunset quality.</li>
      <li>Photographic results.</li><li>The availability or accuracy of third-party data.</li>
      <li>That a notification will be delivered at a particular time.</li>
    </ul>
    <p>You are responsible for checking current local conditions and exercising your own judgment before traveling or participating in outdoor activities.</p>

    <h2>Safety</h2>
    <p>Do not rely on Simple Sunset for emergency, navigation, aviation, maritime, medical, or other safety-critical decisions.</p>
    <p>When photographing outdoors, remain aware of weather, traffic, terrain, tides, wildlife, property boundaries, closures, and other hazards. Follow applicable laws, posted rules, and instructions from local authorities.</p>

    <h2>Location and Notifications</h2>
    <p>Location access is optional and is used to identify the nearest supported forecast city. If a suitable city is unavailable, you may select another supported city manually.</p>
    <p>Notifications are optional. You are responsible for configuring notification permissions and preferences. Device settings, operating-system behavior, network availability, and changing prediction data may affect whether or when a notification appears.</p>

    <h2>Third-Party Data and Services</h2>
    <p>Simple Sunset uses data or infrastructure provided by third parties, including Open-Meteo and GitHub.</p>
    <p>These services are operated independently and may change, delay, restrict, or discontinue their services without notice. Their own terms and privacy policies apply to their services.</p>
    <p>Ryan Burgess does not control and is not responsible for the availability, accuracy, security, or practices of third-party services.</p>

    <h2>Intellectual Property</h2>
    <p>Simple Sunset, including its name, logo, design, interface, original text, photography-scoring methods, and application code, is owned by Ryan Burgess or used with permission and is protected by applicable intellectual-property laws.</p>
    <p>You may use the application for personal, lawful purposes. You may not copy, modify, distribute, sell, sublicense, reverse engineer, or exploit the application except where applicable law expressly permits it.</p>
    <p>Third-party names, data, and trademarks remain the property of their respective owners.</p>

    <h2>Acceptable Use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use Simple Sunset for unlawful purposes.</li><li>Attempt to interfere with or disrupt the app or its data sources.</li>
      <li>Attempt to gain unauthorized access to systems connected to the app.</li>
      <li>Misrepresent Simple Sunset’s forecasts as guaranteed professional or safety advice.</li>
      <li>Use automated methods to abuse or place unreasonable demand on the app’s third-party services.</li>
    </ul>

    <h2>Availability and Changes</h2>
    <p>Simple Sunset may be updated, modified, suspended, or discontinued at any time. Features, supported cities, data sources, forecast methods, and system requirements may change.</p>
    <p>Ryan Burgess is not obligated to maintain any particular feature or continue supporting any particular location or device.</p>

    <h2>Disclaimer of Warranties</h2>
    <p>To the fullest extent permitted by law, Simple Sunset is provided “as is” and “as available,” without warranties of any kind, express or implied.</p>
    <p>Ryan Burgess disclaims warranties including merchantability, fitness for a particular purpose, accuracy, availability, reliability, and non-infringement.</p>
    <p>Some jurisdictions do not permit certain warranty exclusions, so portions of this section may not apply to you.</p>

    <h2>Limitation of Liability</h2>
    <p>To the fullest extent permitted by law, Ryan Burgess will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, Simple Sunset.</p>
    <p>This includes loss or damage connected with travel decisions, missed photographic opportunities, inaccurate forecasts, changing weather, unavailable data, missed notifications, device behavior, or reliance on photography guidance.</p>
    <p>Where liability cannot legally be excluded, it will be limited to the minimum amount permitted by applicable law.</p>

    <h2>Indemnification</h2>
    <p>To the extent permitted by law, you agree to indemnify and hold Ryan Burgess harmless from claims, damages, liabilities, and expenses arising from your unlawful use of Simple Sunset or your violation of these Terms.</p>

    <h2>Apple</h2>
    <p>These Terms are between you and Ryan Burgess, not Apple. Apple is not responsible for Simple Sunset or its content, maintenance, support, or warranties, except as required by applicable law or Apple’s platform terms.</p>
    <p>Your use of the application must also comply with applicable App Store terms.</p>

    <h2>Governing Law</h2>
    <p>These Terms are governed by the laws of the State of California, without regard to conflict-of-law principles, except where the laws of your jurisdiction require otherwise.</p>

    <h2>Changes to These Terms</h2>
    <p>These Terms may be updated as Simple Sunset evolves. The effective date at the top of this page will be revised when changes are made.</p>
    <p>Continued use of Simple Sunset after updated Terms become effective constitutes acceptance of the updated Terms, to the extent permitted by law.</p>

    <h2>Contact</h2>
    <ContactDetails intro="Questions about these Terms or Simple Sunset can be submitted through:" />
  </LegalPage>;
}
