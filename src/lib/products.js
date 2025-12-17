export async function fetchProducts() {
  const res = await fetch("/products.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load products.json (${res.status})`);
  return await res.json();
}

export function categoryFromType(type) {
  if (type === "magazine") return "magazines";
  if (type === "print") return "prints";
  return type;
}