import { fileURLToPath } from "node:url";
// This file has been automatically migrated to valid ESM format by Storybook.
import {createRequire} from "node:module";
import {dirname, join} from "node:path";
import remarkGfm from 'remark-gfm';

const require = createRequire(import.meta.url);

/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
    stories: [
        "../packages/**/stories/*.mdx", // 👈 Add this, to match your project's structure
        "../packages/**/stories/*.js", // 👈 Add this, to match your project's structure
        "../stories/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    core: {
        disableTelemetry: true, // 👈 Disables telemetry
        disableWhatsNewNotifications: true  // 👈 Disables whats new notifications
    },
    addons: [
        {
            name: getAbsolutePath("@storybook/addon-docs"),
            options: {
                csfPluginOptions: null,
                mdxPluginOptions: {
                    mdxCompileOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                },
            }
        }
    ],
    framework: {
        name: getAbsolutePath("@storybook/web-components-vite"),
        options: {}
    },
    staticDirs: [
        "../stories/public",
        "../stories/static"
    ]
};

export default config;

function getAbsolutePath(value) {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}