// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thecocktaildb.com",
        port: "",
        pathname: "/images/media/drink/**",
      },
      {
        protocol: "https",
        hostname: "www.thecocktaildb.com",
        port: "",
        pathname: "/images/ingredients/**",
      },
    ],
  },
  experimental: {
    turbo: false,
  },
  // force webpack instead of Turbopack
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;

// module.exports = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "www.thecocktaildb.com",
//         port: "",
//         pathname: "/images/media/drink/**",
//       },
//     ],
//   },
// };
