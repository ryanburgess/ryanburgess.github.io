import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MEASUREMENT_ID = "G-Q0J9ZTMGBF";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

let initialized = false;
let lastTrackedPage = "";

function initializeGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  if (!initialized) {
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
    initialized = true;
  }
}

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (LOCAL_HOSTNAMES.has(window.location.hostname)) return undefined;

    initializeGoogleAnalytics();
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    if (pagePath === lastTrackedPage) return undefined;
    lastTrackedPage = pagePath;

    const frameId = window.requestAnimationFrame(() => {
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_path: pagePath,
        page_title: document.title,
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.hash, location.pathname, location.search]);

  return null;
}
