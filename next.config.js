const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  future: { webpack5: true },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
};

// module.exports = withPlugins([], nextConfig);
module.exports = withPlugins([[withPWA]], nextConfig);
