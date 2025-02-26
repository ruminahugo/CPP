/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)", // Áp dụng cho toàn bộ trang web
          headers: [
            {
              key: "Content-Security-Policy",
              value: `
              default-src 'self';
              script-src 'self' 'sha256-abc123...' https://apis.google.com;
              style-src 'self' 'sha256-def456...' https://fonts.googleapis.com;
              img-src 'self' data: https:;
              object-src 'none';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, " "), // Xóa khoảng trắng thừa
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  