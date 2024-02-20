/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '.next/cache/webpack',
      ]
    }
  }
}

module.exports = nextConfig
