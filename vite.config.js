import { defineConfig } from "vite";

export default defineConfig({
  root: "src", // Set the root to the src directory
  server: {
    port: 3000,
  },
  build: {
    outDir: "../dist", // Output directory outside of src
    rollupOptions: {
      input: "src/index.html", // Entry point for the build
    },
  },
});
