/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactPlugin = require('eslint-plugin-react');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
        plugins: {
            react: reactPlugin,
            'react-native': reactNativePlugin,
        },
    },
    {
        rules: {
            'react/display-name': 'off',
            'react-native/no-unused-styles': 'warn',
            'react-native/split-platform-components': 'off',
            'react-native/no-inline-styles': 'off',
            'react-native/no-color-literals': 'off',
            'react-native/no-raw-text': 'error',
            'react-native/no-single-element-style-arrays': 'warn',
        },
    },
]);
