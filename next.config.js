module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.node = {
      fs: 'empty',
    };

    // Important: return the modified config
    return config;
  },
};
