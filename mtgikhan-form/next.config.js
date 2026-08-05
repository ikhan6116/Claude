/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      // Serve the multi-funnel application form (static HTML in public/) at the root URL
      { source: '/', destination: '/form.html' },
    ]
  },
}

module.exports = nextConfig
