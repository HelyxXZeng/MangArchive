import { createProxyMiddleware } from "http-proxy-middleware";

const API_URL = "https://api.mangadex.org";

export default createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api": "", // Chuyển hướng các request từ `/api` đến API gốc.
  },
});
