import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/redux-essentials/" : "/";
  return {
    plugins: [react()],
    base: base,
  };
});
