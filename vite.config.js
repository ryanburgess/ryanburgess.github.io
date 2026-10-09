import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "/", // important
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        photographyResources: fileURLToPath(
          new URL("./resources/photography/index.html", import.meta.url)
        ),
      },
    },
  },
});
