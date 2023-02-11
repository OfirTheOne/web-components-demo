
export class BaseWebComponent extends HTMLElement {

    public readonly shadow: ShadowRoot;
    public readonly styleElement: HTMLStyleElement;
    public readonly container: HTMLElement;

    get outerContainer() {
        return this;
    }
    get childrenCollection() {
        return this.container.children;
    }

    get classCollection() {
        return this.container.classList;
    }

    constructor(containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement  = 'template') {
        super();
        this.shadow = this.buildShadow();
        this.styleElement = document.createElement('style');
        this.appendToShadow(this.styleElement);
        this.container = this.buildContainer(containerElementOrTag);
        this.appendToShadow(this.container);
        this.attachChildNodes();
    }
    private buildShadow() {
        return this.attachShadow({ mode: 'open' });
    }
    private buildContainer(containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement) {
        const container = typeof containerElementOrTag == 'string' ? 
            document.createElement(containerElementOrTag) : containerElementOrTag;
        container.style.display = "unset";
        return container;
    }
    protected appendToShadow(elem: HTMLElement): void {
        this.shadow.appendChild(elem);
    }
    protected attachChildNodes(): void {
        const children = this.childNodes;
        this.container.append(...children);
        children.forEach(node => this.removeChild(node));
    }

}