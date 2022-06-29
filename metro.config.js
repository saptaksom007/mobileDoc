const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts

module.exports = {
  resolver: {
    sourceExts: ['js', 'json', 'jsx', 'ts', 'tsx'],
    assetExts: [...defaultAssetExts, 'woff'],
  },
}
