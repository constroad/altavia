/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    outputFileTracingExcludes: {
      '*': [
        '.next/cache/webpack',
      ]
    }
  }
}

module.exports = nextConfig
