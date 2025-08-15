// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    // Apply NativeWind config
    const nwConfig = withNativeWind(config, { input: './global.css', inlineRem: 16 });

    // Extract transformer & resolver
    const { transformer, resolver } = nwConfig;

    // Add SVG transformer config
    nwConfig.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
    };

    nwConfig.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...resolver.sourceExts, 'svg'],
    };

    return nwConfig;
})();
