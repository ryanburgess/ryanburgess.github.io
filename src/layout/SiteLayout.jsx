import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Newsletter from "../components/Newsletter";

export default function SiteLayout({ children, showNewsletter = true }) {
  return (
    <>
      <SiteHeader />

      <main>{children}</main>

      {showNewsletter ? <Newsletter /> : null}

      <SiteFooter />
    </>
  );
}