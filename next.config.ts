import withBundleAnalyzer from '@next/bundle-analyzer';
import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
// Define the base Next.js configuration

const isStandalone = process.env.BUILD_STANDALONE === 'true';
const HOST_NAMES = process.env.HOST_NAMES?.split(',') || [];

const baseConfig: NextConfig = {
  output: isStandalone ? 'standalone' : undefined,
  trailingSlash: true,
  eslint: {
    dirs: ['src']
  },
  images: {
    remotePatterns: HOST_NAMES.map((host) => ({
      hostname: host
    }))
  }
};

// Create a plugin for Next.js to handle internationalization
let configWithPlugins: NextConfig = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
})(baseConfig);

// Conditionally enable bundle analysis
if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

export default configWithPlugins;
