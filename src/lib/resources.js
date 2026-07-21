let resourcesPromise;

export function fetchResources() {
  if (!resourcesPromise) {
    resourcesPromise = fetch("/resources.json", { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error("Failed to load resources.json");
      return response.json();
    });
  }

  return resourcesPromise;
}
