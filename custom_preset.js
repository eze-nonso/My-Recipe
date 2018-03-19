
const babelPresetEnv = require('babel-preset-env');

const babelModuleExports = require('babel-plugin-add-module-exports');

module.exports = {
  presets: [
    babelPresetEnv,
  ],
  plugins: [
    babelModuleExports,
  ],
};
