
export class BaseWebComponent extends HTMLElement {

    public readonly shadow: ShadowRoot;
    public readonly styleElement: HTMLStyleElement;
    public readonly container: HTMLElement;

    constructor(containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement  = 'template') {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.styleElement = document.createElement('style');
        this.shadow.appendChild(this.styleElement);
        this.container = typeof containerElementOrTag == 'string' ? 
            document.createElement(containerElementOrTag) : containerElementOrTag;
        this.container.style.display = "unset";
        this.shadow.appendChild(this.container);
    }

}