export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-left">
        <span>&copy; {year} Ryan Burgess Photography</span>
      </div>

      <div className="footer-right">
        <a href="/store">Store</a>
        <a href="/portfolio">Portfolio</a>
        <a href="https://www.instagram.com/ryan.burgess" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>
    </footer>
  );
}