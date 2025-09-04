/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // GitHub Pages 项目页需要设置 basePath 与 assetPrefix
  basePath: '/wuliu',
  assetPrefix: '/wuliu/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
