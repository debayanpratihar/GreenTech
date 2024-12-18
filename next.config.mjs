import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

export default isProd
    ? withPWA({
          dest: 'public',
          register: true,
          skipWaiting: true,
          pwa: {
              dest: 'public',
              register: true,
              skipWaiting: true,
          },
          images: {
              remotePatterns: [
                  {
                      protocol: "https",
                      hostname: "**",
                  },
              ],
          },
          experimental: {
              missingSuspenseWithCSRBailout: false,
          },
      })
    : {
          images: {
              remotePatterns: [
                  {
                      protocol: "https",
                      hostname: "**",
                  },
              ],
          },
          experimental: {
              missingSuspenseWithCSRBailout: false,
          },
      };
