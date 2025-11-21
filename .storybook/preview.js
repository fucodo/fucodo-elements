import { INITIAL_VIEWPORTS } from 'storybook/viewport';

export default {
    parameters: {
        docs: {
            codePanel: true,
        },
        viewport: {
            options: INITIAL_VIEWPORTS,
        },
    },
    initialGlobals: {
        // viewport: { value: 'ipad', isRotated: false },
    },
};
