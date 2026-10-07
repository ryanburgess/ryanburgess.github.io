import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Store from "./pages/Store";
import ProductCatalog from "./pages/ProductCatalog";
import StoreProduct from "./pages/StoreProduct";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Thanks from "./pages/Thanks";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import ColorExposureCheatSheet from "./pages/ColorExposureCheatSheet";
import PhotographyResources from "./pages/PhotographyResources";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* store landing */}
      <Route path="/store" element={<Store />} />

      {/* store subpages */}
      <Route path="/store/:category" element={<ProductCatalog />} />
      <Route path="/store/products/:slug" element={<StoreProduct />} />
      

      {/* other pages... */}
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/photography" element={<PhotographyResources />} />
      <Route path="/resources/:slug" element={<ResourceDetail />} />
      <Route path="/guides/color-cheat-sheet" element={<ColorExposureCheatSheet />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact/thanks" element={<Thanks />} />
    </Routes>
  );
}
