import dns from "node:dns";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://github.com/vitejs/vite/discussions/7620#discussioncomment-3166670
// https://github.com/nodejs/node/issues/40537#issuecomment-1237194449
// node no longer resorts IP address lookups and takes OS preference
dns.setDefaultResultOrder("ipv4first");

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  plugins: [react()],
});
