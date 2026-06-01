import withPWAInit from "@ducanh2912/next-pwa";
import nextMdx from "@next/mdx";

// /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "masilgasil-image.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

// module.exports = withMDX(nextConfig);

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    // remarkPlugins: [remarkGfm],
    // providerImportSource: "@mdx-js/react",
  },
});

/**
 * @type {import('next').NextConfig}
 */
export default withPWA(withMDX(nextConfig));
