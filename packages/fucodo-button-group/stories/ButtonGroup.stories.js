import '../dist/index.js';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const cssVariables = {
    '--button-color': { value: '#0d6efd', control: 'color', category: 'Button colors' },
    '--button-text-color': { value: 'white', control: 'color', category: 'Button colors' },
    '--button-border-color': { value: '#0d6efd', control: 'color', category: 'Button colors' },
    '--button-focus-color': { value: '#80b7ff', control: 'color', category: 'Button colors' },
    '--button-font-family': { value: 'Arial, sans-serif', control: 'text', category: 'Typography' },
    '--button-font-size': { value: '1rem', control: 'text', category: 'Typography' },
    '--button-min-height': { value: '2.75rem', control: 'text', category: 'Dimensions and spacing' },
    '--button-padding-block': { value: '.5rem', control: 'text', category: 'Dimensions and spacing' },
    '--button-padding-inline': { value: '1rem', control: 'text', category: 'Dimensions and spacing' },
    '--button-toggle-padding-inline': { value: '.75rem', control: 'text', category: 'Dimensions and spacing' },
    '--button-radius': { value: '.375rem', control: 'text', category: 'Dimensions and spacing' },
    '--button-group-gap': { value: '.5rem', control: 'text', category: 'Dimensions and spacing' },
    '--button-menu-background': { value: 'white', control: 'color', category: 'Dropdown menu colors' },
    '--button-menu-color': { value: '#212529', control: 'color', category: 'Dropdown menu colors' },
    '--button-menu-hover': { value: '#eee', control: 'color', category: 'Dropdown menu colors' },
};

const cssVariableStyles = args => styleMap(Object.fromEntries(
    Object.keys(cssVariables)
        .filter(name => args[name])
        .map(name => [name, args[name]]),
));

const buttonGroup = (args, label, content) => html`
    <fucodo-button-group label=${label} style=${cssVariableStyles(args)}>
        ${content}
    </fucodo-button-group>
`;

export default {
    title: 'Components/Button Group',
    component: 'fucodo-button-group',
    tags: ['autodocs'],
    args: {
        label: 'Page actions',
        ...Object.fromEntries(Object.entries(cssVariables).map(([name, { value }]) => [name, value])),
    },
    argTypes: {
        label: { control: 'text' },
        ...Object.fromEntries(Object.entries(cssVariables).map(([name, { value, control, category }]) => [name, {
            control,
            description: `CSS custom property \`${name}\``,
            table: { category: `CSS variables: ${category}`, defaultValue: { summary: value } },
        }])),
    },
    render: args => buttonGroup(args, args.label, html`
        <ul>
            <li><a href="#overview">Overview</a></li>
            <li>
                <a href="#download">Download</a>
                <ul>
                    <li><a href="#pdf" download>Download PDF</a></li>
                    <li><a href="#csv">Download CSV</a></li>
                </ul>
            </li>
            <li>
                Share
                <ul>
                    <li><a href="#email">Email</a></li>
                    <li><a href="#copy">Copy link</a></li>
                </ul>
            </li>
            <li>Coming soon</li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    `),
};

export const Mixed = {};
export const SingleButton = {
    render: args => buttonGroup(args, 'Single action', html`
            <ul>
                <li><a href="#save">Save</a></li>
            </ul>
    `),
};
export const Dropdown = {
    render: args => buttonGroup(args, 'Document actions', html`
            <ul>
                <li>
                    <span>Downloads</span>
                    <ul>
                        <li><a href="#pdf">Download PDF</a></li>
                        <li><a href="#csv">Download CSV</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#share">Share</a>
                    <ul>
                        <li><a href="#email">Email</a></li>
                    </ul>
                </li>
            </ul>
    `),
};
export const DisabledItems = {
    render: args => buttonGroup(args, 'Available actions', html`
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li>Coming soon</li>
                <li><span>Unavailable</span></li>
                <li>
                    <span>Downloads</span>
                    <ul>
                        <li>PDF coming soon</li>
                        <li><a href="#csv">Download CSV</a></li>
                        <li><span>Archive unavailable</span></li>
                    </ul>
                </li>
            </ul>
    `),
};
export const StandardLinks = {
    render: args => buttonGroup(args, 'Navigation', html`
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
    `),
};
export const MultipleSplitButtons = {
    render: args => buttonGroup(args, 'Document actions', html`
            <ul>
                <li>
                    <a href="#download">Download</a>
                    <ul>
                        <li><a href="#pdf">PDF</a></li>
                        <li><a href="#csv">CSV</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#share">Share</a>
                    <ul>
                        <li><a href="#email">Email</a></li>
                        <li><a href="#copy">Copy link</a></li>
                    </ul>
                </li>
            </ul>
    `),
};
export const NarrowContainer = {
    render: args => html`<div style="width: 230px; max-width: 100%">
        ${buttonGroup(args, args.label, html`
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li>
                    <a href="#documents">Documents</a>
                    <ul>
                        <li><a href="#report">Annual report</a></li>
                    </ul>
                </li>
                <li><a href="#contact">Contact us</a></li>
            </ul>
        `)}
    </div>`,
};
