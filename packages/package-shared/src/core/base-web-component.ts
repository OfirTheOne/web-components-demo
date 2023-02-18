import { DefineComponentOptions } from "../models/define-component-options";

export abstract class BaseWebComponent<S = any> extends HTMLElement {

    public readonly shadow: ShadowRoot;
    public readonly styleElement: HTMLStyleElement;
    public container: HTMLElement;
    public readonly attr: S;
    
    get outerContainer() {
        return this;
    }
    get childrenCollection() {
        return this.container.children;
    }
    get classCollection() {
        return this.container.classList;
    }

    constructor() {
        super();
        this.shadow = this.buildShadow();
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = this.buildStyle();
        this.appendToShadow(this.styleElement);
        this.container = this.buildContainer(this.buildTemplate());
        this.appendToShadow(this.container);
        this.attachChildNodes();
        this.attr = this.proxyAttributes();

    }

    abstract buildStyle(): string;
    abstract buildTemplate(): any;

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
    protected forceRender() {
        this.shadow.childNodes.forEach(node => this.shadow.removeChild(node));
        this.styleElement.textContent = this.buildStyle();
        this.appendToShadow(this.styleElement);
        this.container = this.buildContainer(this.buildTemplate());
        this.appendToShadow(this.container);
    }
    protected attachChildNodes(): void {
        const children = this.childNodes;
        this.container.append(...children);
        children.forEach(node => this.removeChild(node));
    }
    private proxyAttributes(): S {
        return new Proxy(this as BaseWebComponent, {
            get: (target: BaseWebComponent, p: string, _receiver: any) => {
              return target.getAttribute(p);
            },
            set: (target: BaseWebComponent, p: string, newValue: any, _receiver: any) => {
              newValue ? target.setAttribute(p, newValue) : target.removeAttribute(p);
              return true;
            },
          }) as S;
    }

}