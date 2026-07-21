/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      // Serve the credit application (static HTML in public/) at the root URL
      { source: '/', destination: '/app.html' },
    ]
  },
}

module.exports = nextConfig
