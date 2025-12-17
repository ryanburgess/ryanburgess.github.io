import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Store from "./pages/Store";
import ProductCatalog from "./pages/ProductCatalog";
import StoreProduct from "./pages/StoreProduct";

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
    </Routes>
  );
}