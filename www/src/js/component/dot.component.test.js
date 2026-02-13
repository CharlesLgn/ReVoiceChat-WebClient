import {beforeEach, afterEach, describe, expect, test} from 'vitest';

// Import du fichier qui enregistre les custom elements
import './dot.component.js';

describe('DotComponent', () => {
    let icon;
    let shadowRoot;
    beforeEach(async () => {
        icon = document.createElement('revoice-dot');
        icon.setAttribute('type', 'status');
        document.body.appendChild(icon);
        await new Promise(resolve => setTimeout(resolve, 0));
        shadowRoot = icon.shadowRoot;
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should render an element', () => {
        const data = document.querySelector('revoice-dot');
        expect(data).not.toBeNull();
    });

    test('should have shadow root', () => {
        expect(shadowRoot).not.toBeNull();
    });

    test('should render content in shadow DOM', () => {
        const element = shadowRoot.querySelector('.background-gray');
        expect(element).not.toBeNull();
    });

    test('should have specific styles or structure', () => {
        const styles = shadowRoot.querySelector('.background-green');
        expect(styles).toBeNull();
    });

    test('change color', () => {
        let styles = shadowRoot.querySelector('.background-red');
        expect(styles).toBeNull();
        const data = document.querySelector('revoice-dot');
        data.setAttribute('color', 'red');
        styles = shadowRoot.querySelector('.background-red');
        expect(styles).not.toBeNull();
    });

    test('change to same color', () => {
        const data = document.querySelector('revoice-dot');
        data.setAttribute('color', 'red');
        let styles = shadowRoot.querySelector('.background-red');
        expect(styles).not.toBeNull();
        data.setAttribute('color', 'red');
        styles = shadowRoot.querySelector('.background-red');
        expect(styles).not.toBeNull();
    });

    test('change to unknown color', () => {
        const data = document.querySelector('revoice-dot');
        data.setAttribute('color', 'not a color');
        let styles = shadowRoot.querySelector('.background-red');
        expect(styles).toBeNull();
        styles = shadowRoot.querySelector('.background-gray');
        expect(styles).not.toBeNull();
    });

    test('type', () => {
        const styles = shadowRoot.querySelector('.status');
        expect(styles).not.toBeNull();
    });

    test('type', async () => {
        const icon = document.createElement('revoice-dot');
        icon.setAttribute('type', 'statuss');
        document.body.appendChild(icon);
        await new Promise(resolve => setTimeout(resolve, 0));
        const shadowRoot = icon.shadowRoot;
        const styles = shadowRoot.querySelector('.status');
        expect(styles).toBeNull();
    });
});