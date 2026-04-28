import type { NextConfig } from "next";

const jobBackendUrl = process.env.BACKEND_URL_JOB_SERVICE ?? "http://localhost:5001";
const userBackendUrl = process.env.BACKEND_URL_USER_SERVICE ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  // Proxy two backend services to avoid CORS in development.
  async rewrites() {
    return [
      {
        source: "/api/job-service/:path*",
        destination: `${jobBackendUrl}/:path*`,
      },
      {
        source: "/api/user-service/:path*",
        destination: `${userBackendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
