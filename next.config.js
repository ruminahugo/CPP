module.exports = {
    async redirects() {
      return [
        {
          source: '/(.*)',
          has: [
            {
              type: 'protocol',
              value: 'http',
            },
          ],
          permanent: true,
          destination: 'https://cpp-production.up.railway.app/:path*',
        },
      ];
    },
  };
  