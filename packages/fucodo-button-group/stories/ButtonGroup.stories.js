import '../dist/index.js';
import { html } from 'lit';

export default {
    title: 'Components/Button Group',
    component: 'fucodo-button-group',
    tags: ['autodocs'],
    args: { label: 'Page actions' },
    argTypes: {
        label: { control: 'text' },
    },
    render: ({ label }) => html`
        <fucodo-button-group label=${label}>
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li>
                    <a href="#download">Download</a>
                    <ul>
                        <li><a href="#pdf" download>Download PDF</a></li>
                        <li><a href="#csv">Download CSV</a></li>
                    </ul>
                </li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </fucodo-button-group>
    `,
};

export const Mixed = {};
export const DisabledItems = {
    render: () => html`
        <fucodo-button-group label="Available actions">
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li>Coming soon</li>
                <li><a>Unavailable</a></li>
                <li><span>Downloads</span><ul>
                    <li>PDF coming soon</li>
                    <li><a href="#csv">Download CSV</a></li>
                    <li><a href="">Archive unavailable</a></li>
                </ul></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const StandardLinks = {
    render: () => html`
        <fucodo-button-group label="Navigation">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const MultipleSplitButtons = {
    render: () => html`
        <fucodo-button-group label="Document actions">
            <ul>
                <li><a href="#download">Download</a><ul>
                    <li><a href="#pdf">PDF</a></li><li><a href="#csv">CSV</a></li>
                </ul></li>
                <li><a href="#share">Share</a><ul>
                    <li><a href="#email">Email</a></li><li><a href="#copy">Copy link</a></li>
                </ul></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const NarrowContainer = {
    render: args => html`<div style="width: 230px; max-width: 100%">
        <fucodo-button-group label=${args.label}>
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li><a href="#documents">Documents</a><ul>
                    <li><a href="#report">Annual report</a></li>
                </ul></li>
                <li><a href="#contact">Contact us</a></li>
            </ul>
        </fucodo-button-group>
    </div>`,
};
