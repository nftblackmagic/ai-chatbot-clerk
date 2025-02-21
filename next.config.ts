import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: true
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      }
    ]
  }
}

export default nextConfig
