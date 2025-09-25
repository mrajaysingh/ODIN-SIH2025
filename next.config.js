/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['odin.skyber.dev'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/bg-img-1.jpg', destination: '/incident/ocean-flood.jpg' },
      { source: '/bg-img-2.jpg', destination: '/incident/kerala-flood.jpg' },
      { source: '/bg-img-3.jpg', destination: '/incident/punjab-flood.jpg' },
      { source: '/bg-img-4.jpeg', destination: '/incident/urban-flood-and-relief.jpg' },
      { source: '/bg-img-5.png', destination: '/incident/high-tide-near-ocean.png' },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
