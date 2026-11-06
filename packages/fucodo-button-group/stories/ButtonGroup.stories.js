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
            </ul>
            <ul>
                <li><a href="#download">Download</a></li>
                <li><a href="#pdf" download>Download PDF</a></li>
                <li><a href="#csv">Download CSV</a></li>
            </ul>
            <ul>
                <li>Share</li>
                <li><a href="#email">Email</a></li>
                <li><a href="#copy">Copy link</a></li>
            </ul>
            <ul>
                <li>Coming soon</li>
            </ul>
            <ul>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </fucodo-button-group>
    `,
};

export const Mixed = {};
export const Dropdown = {
    render: () => html`
        <fucodo-button-group label="Document actions">
            <ul>
                <li><span>Downloads</span></li>
                <li><a href="#pdf">Download PDF</a></li>
                <li><a href="#csv">Download CSV</a></li>
            </ul>
            <ul>
                <li><a href="#share">Share</a></li>
                <li><a href="#email">Email</a></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const DisabledItems = {
    render: () => html`
        <fucodo-button-group label="Available actions">
            <ul>
                <li><a href="#overview">Overview</a></li>
            </ul>
            <ul>
                <li>Coming soon</li>
            </ul>
            <ul>
                <li><a>Unavailable</a></li>
            </ul>
            <ul>
                <li><span>Downloads</span></li>
                <li>PDF coming soon</li>
                <li><a href="#csv">Download CSV</a></li>
                <li><a href="">Archive unavailable</a></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const StandardLinks = {
    render: () => html`
        <fucodo-button-group label="Navigation">
            <ul>
                <li><a href="#home">Home</a></li>
            </ul>
            <ul>
                <li><a href="#about">About</a></li>
            </ul>
            <ul>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const MultipleSplitButtons = {
    render: () => html`
        <fucodo-button-group label="Document actions">
            <ul>
                <li><a href="#download">Download</a></li>
                <li><a href="#pdf">PDF</a></li>
                <li><a href="#csv">CSV</a></li>
            </ul>
            <ul>
                <li><a href="#share">Share</a></li>
                <li><a href="#email">Email</a></li>
                <li><a href="#copy">Copy link</a></li>
            </ul>
        </fucodo-button-group>
    `,
};
export const NarrowContainer = {
    render: args => html`<div style="width: 230px; max-width: 100%">
        <fucodo-button-group label=${args.label}>
            <ul>
                <li><a href="#overview">Overview</a></li>
            </ul>
            <ul>
                <li><a href="#documents">Documents</a></li>
                <li><a href="#report">Annual report</a></li>
            </ul>
            <ul>
                <li><a href="#contact">Contact us</a></li>
            </ul>
        </fucodo-button-group>
    </div>`,
};
