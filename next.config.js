/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'bafybeiemb5ddkibe2hl4z5iqd5x2wzrkskf5swqu6gksp7yub4lqtczlhu.ipfs.w3s.link',
      'bafybeicodlej4oiq6fq5lfztym5tvgndslczfqyvquvpamdloqvjrf7lly.ipfs.w3s.link',
      'bafybeif6r7nj3qvhwc7ivbep7b7loihjpwswnz22qamdte26pcbsxdqgke.ipfs.w3s.link'
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "connect-src 'self' https://* wss://*",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://cdnjs.cloudflare.com https://cdn.farcaster.xyz https://cdn.warpcast.com blob:",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: https://*.ipfs.w3s.link",
              "frame-src 'self' https://vercel.live https://*.farcaster.xyz https://*.warpcast.com"
            ].join('; ')
          }
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    return config
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/.well-known/farcaster'
      }
    ]
  }
}

module.exports = nextConfig;
