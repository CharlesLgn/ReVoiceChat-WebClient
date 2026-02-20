import { beforeEach, afterEach, describe, expect, test } from 'vitest';

// Import du fichier qui enregistre les custom elements
import './icon.component.js';
import {icons} from "./icon.component.js";

describe('IconComponent', () => {
    for (let iconsKey in icons) {
        describe(iconsKey, () => {
            beforeEach(async () => {
                const icon = document.createElement(iconsKey);
                document.body.appendChild(icon);
                // Attendre que le custom element soit complètement initialisé
                await new Promise(resolve => setTimeout(resolve, 0));
            });

            afterEach(() => {
                document.body.innerHTML = '';
            });
            test('should render an SVG element', () => {
                const svg = document.querySelectorAll('svg');
                expect(svg).not.toBeNull();
                expect(svg.length).toBe(1);
            });
        });
    }
});