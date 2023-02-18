
import { IPresentable } from "../models/i-presentable";

export class WCContainer<S = any> extends HTMLElement {

    protected attr: S;
    protected readonly shadow: ShadowRoot;
    protected readonly styleElement: HTMLStyleElement;
    protected container: HTMLElement;
    protected readonly _host: HTMLElement;
    protected _presentable: IPresentable;
    protected _props: any;
    protected _children: any;

    get host(): HTMLElement {
        return this._host;
    }

    constructor() {
        super();
        this._host = this; // document.createElement('slot');
        this.styleElement = document.createElement('style');
        this.shadow = this.buildShadow();
        // this.attr = this.proxyAttributes();
        
    }

    public render(): WCContainer {     
        this.shadow.childNodes.forEach(node => this.shadow.removeChild(node));
        this.styleElement.textContent = this._presentable.buildStyle(this._props);
        this.appendToShadow(this.styleElement);
        this.container = this.buildContainer(this._presentable.buildTemplate(this._props, this._children));
        this.appendToShadow(this.container);
        // this.attachChildNodes();
        return this;
    }
    public setPresentable(p: IPresentable): WCContainer {
        this._presentable = p;
        return this;
    }
    public setProps(props: any = {}): WCContainer {
        this._props = props;
        return this;
    }
    public setChildren(children: any[] = []): WCContainer {
        this._children = children;
        return this;
    }

    private buildShadow() {
        return this._host.attachShadow({ mode: 'open' });
    }  
    private buildContainer(containerElementOrTag: keyof HTMLElementTagNameMap | HTMLElement) {
        const container = typeof containerElementOrTag == 'string' ? 
            document.createElement(containerElementOrTag) : containerElementOrTag;
        // container.style.display = "unset";
        return container;
    }
    private appendToShadow(elem: HTMLElement): void {
        this.shadow.appendChild(elem);
    }
    private attachChildNodes(): void {
        this.container.append(...this._children);
    }
}