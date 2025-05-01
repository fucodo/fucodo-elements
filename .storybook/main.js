

/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    {
      "name": "@storybook/addon-essentials",
      "options": {
        "docs": false
      }
    }
  ],
  "framework": {
    "name": "@storybook/web-components-vite",
    "options": {}
  },
  "staticDirs": ["../stories/public", "../stories/icons"]
};
export default config;