import { useEffect } from "react";
import SiteLayout from "../layout/SiteLayout";

const effectiveDate = "October 19, 2026";

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
      <section className="legal-hero">
        <div className="legal-container">
          <span className="legal-product-name">Simple Sunset</span>
          <h1>{title}</h1>
          <p>Effective date: {effectiveDate}</p>
        </div>
      </section>
      <section className="legal-page">
        <article className="legal-container legal-content">{children}</article>
      </section>
    </SiteLayout>
  );
}

export function SimpleSunsetPrivacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Simple Sunset is a photography forecast application created and operated by Ryan Burgess (“Simple Sunset,” “we,” “us,” or “our”). This Privacy Policy explains how information is handled when you use the Simple Sunset iOS application.</p>

      <h2>Summary</h2>
      <p>Simple Sunset is designed to minimize data collection.</p>
      <ul>
        <li>We do not require you to create an account.</li>
        <li>We do not sell your personal information.</li>
        <li>We do not use advertising SDKs.</li>
        <li>We do not track you across apps or websites.</li>
        <li>We do not use third-party analytics SDKs.</li>
        <li>Your precise device location is not stored by Simple Sunset or transmitted to our forecast providers.</li>
        <li>App preferences and locally recorded prediction history remain on your device.</li>
      </ul>

      <h2>Information handled by the app</h2>
      <h3>Location</h3>
      <p>With your permission, Simple Sunset can access your device’s approximate current location while you are using the app.</p>
      <p>Your location is used to determine which supported forecast city is nearest to you. Simple Sunset does not continuously monitor your location and does not use background location tracking.</p>
      <p>Your device’s current coordinates are not saved to our servers. Once the nearest supported city is determined, the app uses that city’s predefined coordinates when requesting weather information.</p>
      <p>You can decline location permission and select a city manually. You can also change or revoke location permission at any time in iOS Settings.</p>

      <h3>Selected city and preferences</h3>
      <p>Simple Sunset stores preferences on your device, including:</p>
      <ul>
        <li>Your selected and default city</li>
        <li>Temperature units</li>
        <li>Chart display preferences</li>
        <li>Notification preferences</li>
        <li>Notification score threshold</li>
        <li>Whether initial permission prompts have been completed</li>
      </ul>
      <p>These settings are stored locally using Apple-provided storage.</p>

      <h3>Prediction history and cached information</h3>
      <p>Simple Sunset stores historical sunrise and sunset prediction scores locally on your device. It may also temporarily cache forecast and weather information to improve reliability and allow recently loaded information to remain visible when a network request fails.</p>
      <p>Local history remains on your device until you reset it from Settings or delete the app. Cached forecast information can be cleared from the app’s Settings screen.</p>
      <p>Deleting the app removes its locally stored data, subject to normal iOS backup and restoration behavior.</p>

      <h3>Notifications</h3>
      <p>If you enable notifications, Simple Sunset schedules local notifications for eligible sunrise or sunset forecasts.</p>
      <p>Notification preferences and pending notification schedules are stored and managed on your device. You can disable individual sunrise or sunset alerts within the app or revoke notification permission through iOS Settings.</p>

      <h3>Subscription information</h3>
      <p>Subscriptions and payments are processed by Apple through the App Store. Simple Sunset does not receive or store your payment-card information.</p>
      <p>The app receives transaction information from Apple that is necessary to determine whether you have an active subscription. This can include the subscription product, entitlement status, and expiration date.</p>
      <p>Apple’s handling of App Store and subscription information is governed by Apple’s privacy policies:</p>
      <p><ExternalLink href="https://www.apple.com/legal/privacy/data/en/appstore/">Apple App Store Privacy</ExternalLink></p>

      <h2>Third-party services</h2>
      <p>Simple Sunset communicates with the following services to provide forecasts:</p>
      <h3>Open-Meteo</h3>
      <p>The app sends the predefined latitude and longitude of your selected supported city to Open-Meteo to retrieve current weather conditions. It does not send your precise device location.</p>
      <p>Open-Meteo may receive ordinary technical information associated with an internet request, such as an IP address, according to its own policies.</p>
      <p><ExternalLink href="https://open-meteo.com/">Open-Meteo</ExternalLink></p>

      <h3>GitHub</h3>
      <p>Current sunrise and sunset prediction information is retrieved from a publicly hosted GitHub data file. GitHub may process ordinary network-request information, including an IP address, according to its privacy statement.</p>
      <p><ExternalLink href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</ExternalLink></p>

      <h3>Apple</h3>
      <p>Apple provides App Store distribution, StoreKit subscription processing, offer-code redemption, purchase restoration, and notification services. Apple handles information associated with these services under its own privacy policies.</p>
      <p><ExternalLink href="https://www.apple.com/legal/privacy/">Apple Privacy Policy</ExternalLink></p>
      <p>These third-party services operate under their own terms and privacy practices. We do not control their independent data-handling practices.</p>

      <h2>Information we do not collect</h2>
      <p>Simple Sunset does not intentionally collect:</p>
      <ul>
        <li>Your name</li>
        <li>Your email address</li>
        <li>Your contacts</li>
        <li>Photos or photo-library contents</li>
        <li>Advertising identifiers</li>
        <li>Health or financial information</li>
        <li>Precise location history</li>
        <li>User-generated content</li>
        <li>Cross-app or cross-website activity</li>
      </ul>
      <p>The current version does not include advertising, behavioral profiling, or third-party analytics.</p>

      <h2>How information is used</h2>
      <p>Information handled by Simple Sunset is used to:</p>
      <ul>
        <li>Select the nearest supported forecast city</li>
        <li>Retrieve weather and prediction information</li>
        <li>Calculate photography forecast scores</li>
        <li>Save your preferences</li>
        <li>Maintain local prediction history</li>
        <li>Schedule notifications you request</li>
        <li>Verify subscription access</li>
        <li>Diagnose failures directly reported by you</li>
      </ul>
      <p>We do not sell or rent information or use it for targeted advertising.</p>

      <h2>Retention and deletion</h2>
      <p>Preferences and prediction history stored by Simple Sunset remain locally on your device until you reset them or delete the app.</p>
      <p>You can:</p>
      <ul>
        <li>Clear cached prediction and weather data from Settings</li>
        <li>Reset locally recorded history from Settings</li>
        <li>Disable location or notification access through iOS Settings</li>
        <li>Delete all locally stored app data by deleting the app</li>
      </ul>
      <p>Simple Sunset does not currently maintain user accounts or a server-side personal-information database. Because there is no Simple Sunset account, there is generally no server-side account data for us to delete.</p>
      <p>Apple and external forecast providers may retain information they independently process according to their own policies and legal obligations.</p>

      <h2>Security</h2>
      <p>We use the security features provided by iOS and HTTPS network connections when communicating with forecast services. However, no electronic storage or transmission system can be guaranteed to be completely secure.</p>

      <h2>Children’s privacy</h2>
      <p>Simple Sunset is not directed to children under 13, and we do not knowingly collect personal information from children.</p>
      <p>If you believe a child has provided personal information to us, contact us so we can review the situation.</p>

      <h2>International use</h2>
      <p>Forecast services and third-party providers may process network requests in countries other than your own. Their handling of information is governed by their respective privacy policies and applicable law.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this Privacy Policy as Simple Sunset changes. The updated policy will be posted on this page with a revised effective date.</p>
      <p>Material changes may also be communicated through the app or its App Store listing when appropriate.</p>

      <h2>Contact</h2>
      <p>For privacy questions or requests, contact:</p>
      <address>Ryan Burgess<br />Email: <a href="mailto:support@ryanburgess.com">support@ryanburgess.com</a><br />Website: <a href="https://ryanburgess.com">ryanburgess.com</a></address>

      <h2>Your rights</h2>
      <p>Depending on where you live, you may have rights concerning personal information, including access, correction, deletion, or restriction.</p>
      <p>Because Simple Sunset does not currently operate user accounts or maintain a server-side personal-information database, most app information can be controlled directly on your device. You may contact us if you have additional privacy questions.</p>
    </LegalPage>
  );
}

export function SimpleSunsetTerms() {
  return (
    <LegalPage title="Terms of Use">
      <p>These Terms of Use (“Terms”) govern your use of the Simple Sunset iOS application (“Simple Sunset” or the “App”), provided by Ryan Burgess (“we,” “us,” or “our”).</p>
      <p>By downloading, subscribing to, or using Simple Sunset, you agree to these Terms.</p>

      <h2>1. The service</h2>
      <p>Simple Sunset provides photography-oriented sunrise, sunset, weather, and lighting forecasts for supported locations.</p>
      <p>Features may include:</p>
      <ul>
        <li>Sunrise and sunset times</li>
        <li>Sunrise and sunset prediction scores</li>
        <li>Historical prediction information</li>
        <li>Current weather conditions</li>
        <li>Photography condition scores</li>
        <li>Suggested shooting windows</li>
        <li>Forecast notifications</li>
        <li>Location-based selection of a supported city</li>
      </ul>
      <p>The App is intended as a planning and creative-guidance tool.</p>

      <h2>2. Forecast limitations</h2>
      <p>Weather, lighting, visibility, sunrise, sunset, and photography scores are estimates based on third-party data and automated calculations.</p>
      <p>Actual conditions can change quickly and may differ from the information shown in the App. We do not guarantee the accuracy, completeness, availability, or timeliness of any forecast, score, notification, or suggested shooting window.</p>
      <p>Simple Sunset must not be relied upon for:</p>
      <ul>
        <li>Emergency decisions</li>
        <li>Navigation</li>
        <li>Aviation or marine activity</li>
        <li>Public safety</li>
        <li>Severe-weather warnings</li>
        <li>Medical or health decisions</li>
        <li>Any situation where inaccurate information could cause injury, death, or property damage</li>
      </ul>
      <p>Always use appropriate official weather, emergency, and safety resources.</p>

      <h2>3. Subscriptions</h2>
      <p>Simple Sunset requires an active auto-renewable subscription to access its primary features.</p>
      <p>The available subscription options may include:</p>
      <ul>
        <li>Monthly subscription: currently $2.99 per month</li>
        <li>Annual subscription: currently $19.99 per year</li>
      </ul>
      <p>Prices may vary by country, currency, taxes, and future pricing changes. The price displayed by Apple at the time of purchase controls.</p>

      <h3>Free trial</h3>
      <p>Eligible new subscribers may receive a seven-day free trial with the monthly subscription.</p>
      <p>Trial eligibility is determined by Apple. Generally, only one introductory offer is available per Apple subscription group. If you are not eligible, Apple will display the price that will be charged before you confirm the purchase.</p>
      <p>Unless canceled before the trial ends, the subscription automatically converts to the paid monthly subscription shown during purchase.</p>

      <h3>Billing and renewal</h3>
      <p>Payment is charged to your Apple Account.</p>
      <p>Subscriptions renew automatically unless canceled at least 24 hours before the end of the current subscription or trial period. Apple may charge your account for renewal within 24 hours before the current period ends.</p>
      <p>You can view, cancel, or manage your subscription through your Apple Account subscription settings:</p>
      <p><ExternalLink href="https://apps.apple.com/account/subscriptions">Manage Apple subscriptions</ExternalLink></p>
      <p>Deleting Simple Sunset does not automatically cancel a subscription.</p>

      <h3>Annual subscription</h3>
      <p>The annual subscription is billed when you confirm the purchase and automatically renews each year unless canceled before renewal. The annual plan does not currently include a free trial unless Apple displays a separate eligible offer during purchase.</p>

      <h3>Offer codes</h3>
      <p>We may provide subscription offer codes. Eligibility, duration, pricing, expiration, and renewal behavior are displayed by Apple when the code is redeemed.</p>
      <p>Unless an offer explicitly states that it will not renew, a subscription obtained through an offer code may automatically renew at the standard price after the offer period.</p>

      <h3>Restoration and refunds</h3>
      <p>You can restore eligible purchases through the App’s Restore Purchases control.</p>
      <p>Apple processes all payments and refund requests. We do not independently issue App Store refunds. Refund availability is determined by Apple and applicable law.</p>
      <p>You can request assistance from Apple at:</p>
      <p><ExternalLink href="https://reportaproblem.apple.com/">Report a Problem to Apple</ExternalLink></p>

      <h2>4. Location and notifications</h2>
      <p>Location access is optional. If permission is granted, Simple Sunset uses your current location to identify the nearest supported forecast city.</p>
      <p>Not every location is supported. If your location is outside the supported range, the App may ask you to select another city or use a default city.</p>
      <p>Notifications are optional. Delivery time is not guaranteed and may be affected by device settings, network conditions, operating-system behavior, power settings, or changes in forecast information.</p>
      <p>You remain responsible for checking current conditions directly.</p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Reverse engineer or attempt to extract the App’s source code except where applicable law expressly permits it</li>
        <li>Interfere with or disrupt the App or its supporting services</li>
        <li>Circumvent subscription or entitlement checks</li>
        <li>Use automated systems to place unreasonable loads on forecast providers</li>
        <li>Use the App for unlawful, fraudulent, or abusive purposes</li>
        <li>Misrepresent yourself as affiliated with Simple Sunset</li>
        <li>Copy, redistribute, or commercially exploit App content except as permitted by law</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>Simple Sunset, including its design, branding, logo, interface, original text, calculations, and software, is owned by Ryan Burgess or used with permission.</p>
      <p>These Terms provide you with a limited, personal, nonexclusive, nontransferable, and revocable right to use the App for its intended purpose. They do not transfer ownership of the App or its intellectual property to you.</p>
      <p>Weather, prediction, Apple, GitHub, Open-Meteo, and other third-party content or trademarks remain the property of their respective owners.</p>

      <h2>7. Third-party services</h2>
      <p>Simple Sunset depends on third-party services, including Apple, Open-Meteo, and GitHub.</p>
      <p>Those services may be unavailable, delayed, changed, or discontinued without notice. Your use of third-party services may also be governed by their own terms and policies.</p>
      <p>We are not responsible for third-party services, their availability, or their independent acts and omissions.</p>

      <h2>8. Changes to the App</h2>
      <p>We may add, modify, suspend, or discontinue App features at any time.</p>
      <p>Supported locations, forecast calculations, data sources, notification behavior, subscription offerings, and prices may change. When required, subscription-price changes will be communicated and handled through Apple.</p>
      <p>We do not guarantee that every feature will remain available indefinitely.</p>

      <h2>9. Disclaimer of warranties</h2>
      <p>To the maximum extent permitted by applicable law, Simple Sunset is provided “as is” and “as available.”</p>
      <p>We disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, reliability, availability, and noninfringement.</p>
      <p>We do not warrant that the App will be uninterrupted, error-free, secure, or compatible with every device or operating-system version.</p>
      <p>Some jurisdictions do not permit certain warranty exclusions, so portions of this section may not apply to you.</p>

      <h2>10. Limitation of liability</h2>
      <p>To the maximum extent permitted by applicable law, Ryan Burgess will not be liable for indirect, incidental, special, consequential, or punitive damages arising from or related to:</p>
      <ul>
        <li>Your use of or inability to use Simple Sunset</li>
        <li>Reliance on a forecast, score, notification, or shooting-window recommendation</li>
        <li>Missed photographic opportunities</li>
        <li>Travel, equipment, or other expenses</li>
        <li>Third-party services or data</li>
        <li>Loss of data or interruption of service</li>
      </ul>
      <p>Nothing in these Terms excludes liability that cannot lawfully be excluded.</p>

      <h2>11. Indemnification</h2>
      <p>To the extent permitted by law, you agree to indemnify and hold Ryan Burgess harmless from claims, damages, liabilities, and expenses arising from your unlawful use of the App, your violation of these Terms, or your infringement of another person’s rights.</p>
      <p>This section does not apply where prohibited by applicable consumer law.</p>

      <h2>12. Termination</h2>
      <p>You may stop using Simple Sunset at any time. Subscription cancellation must be completed through Apple.</p>
      <p>We may suspend or terminate access where reasonably necessary to address fraud, abuse, security threats, legal obligations, or material violations of these Terms.</p>
      <p>Sections that by their nature should survive termination will remain effective, including intellectual-property, disclaimer, liability, and dispute provisions.</p>

      <h2>13. Governing law</h2>
      <p>These Terms are governed by the laws of the State of California, without regard to conflict-of-law rules.</p>
      <p>If the law where you live provides mandatory consumer protections or gives you the right to bring a claim in your local courts, those protections and rights are not limited by these Terms.</p>

      <h2>14. Apple terms</h2>
      <p>Your use of Simple Sunset is also subject to Apple’s applicable App Store terms and the Apple Standard Licensed Application End User License Agreement:</p>
      <p><ExternalLink href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Apple Standard EULA</ExternalLink></p>
      <p>If these Terms conflict with mandatory Apple terms governing the App Store transaction or license, the applicable Apple terms control to the extent of that conflict.</p>
      <p>Apple is not responsible for providing maintenance or support for Simple Sunset except as required by applicable law.</p>

      <h2>15. Changes to these Terms</h2>
      <p>We may update these Terms to reflect changes to Simple Sunset, subscriptions, legal requirements, or business practices.</p>
      <p>Updated Terms will be posted on this page with a revised effective date. Continued use of the App after updated Terms become effective constitutes acceptance where permitted by law.</p>
      <p>If applicable law requires additional notice or consent, we will provide it.</p>

      <h2>16. Contact</h2>
      <p>Questions about these Terms or Simple Sunset can be directed to:</p>
      <address>Ryan Burgess<br />Email: <a href="mailto:support@ryanburgess.com">support@ryanburgess.com</a><br />Website: <a href="https://ryanburgess.com">ryanburgess.com</a></address>
    </LegalPage>
  );
}
