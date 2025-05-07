

/** @type { import('@storybook/html-webpack5').StorybookConfig } */
const config = {
  "stories": [
    "../stories/**/*.stories.js"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc"
  ],
  "framework": {
    "name": "@storybook/html-webpack5",
    "options": {}
  },
  "staticDirs": ["../stories/public", "../stories/icons"]
};
export default config;