import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "https://api.mangadex.org": {
        target: "https://api.mangadex.org",
        changeOrigin: true,
        secure: true, // Nếu HTTPS không có chứng chỉ hợp lệ, bạn có thể chỉnh false.
      },
    },
  },
});
