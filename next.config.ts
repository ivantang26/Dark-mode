import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "mdx"],
  // Shiki only ever runs on the server (build-time highlighting), so keep it out of the bundle.
  serverExternalPackages: ["shiki"],
};

const withMDX = createMDX({
  // Plugin names as strings so Turbopack can serialise them. GFM gives docs their tables.
  options: { remarkPlugins: [["remark-gfm"]] },
});

export default withMDX(nextConfig);
