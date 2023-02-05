
export class BaseWebComponent extends HTMLElement {

    public readonly shadow: ShadowRoot;
    public readonly styleElement: HTMLStyleElement;
    public readonly container: HTMLElement;

    constructor(containerTag: string = 'template') {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.styleElement = document.createElement('style');
        this.shadow.appendChild(this.styleElement);
        this.container = document.createElement(containerTag);
        this.shadow.appendChild(this.container);
    }

}