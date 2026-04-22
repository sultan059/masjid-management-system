const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs', 'cjs', 'bundle'];
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'bundle');

module.exports = config;
