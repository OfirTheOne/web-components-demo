
interface OnConnected {
    /**
     * This lifecycle hook is triggered when the element is removed from the DOM and is the ideal place to add 
     * cleanup logic (the code that needs to be executed before the element is destroyed) and to free up resources.
     */
    connectedCallback(): void
}
interface OnDisconnected {
    disconnectedCallback(): void
}
interface OnAttributeChanged {
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void
}
interface OnAdopted {
    adoptedCallback(): void
}

class BaseWebComponent<S = any, P = any> extends HTMLElement, implements BaseWebComponentConstructor {
    abstract buildStyle(): string;
    abstract buildTemplate(): JSX.Element | HTMLElement | string;

    public readonly attr: S & { [key: string]: string };
    public get outerContainer(): BaseWebComponent;
    public get childrenCollection(): HTMLCollection;
    public get classCollection(): DOMTokenList;
    public readonly shadow: ShadowRoot;
    public readonly styleElement: HTMLStyleElement;
    public readonly container: HTMLElement;
    constructor(prop?: P);
    constructor(containerTag?: keyof HTMLElementTagNameMap, css?: string);
    protected appendToShadow(elem: HTMLElement): void;
    protected attachChildNodes(): void ;
};


declare namespace JSX {
    interface ElementClass extends BaseWebComponent { }
}



interface BaseWebComponentConstructor {
    new (...params: any[]): JSX.ElementClass;
}



declare module 'shared/utils' {


    function attachShadowDom(
        component: HTMLElement,
        container: HTMLElement,
        style: HTMLStyleElement
    ): ShadowRoot;
    function defineComponent(
        name: string, 
        ctor: CustomElementConstructor, 
        options?: ElementDefinitionOptions | undefined
    ): CustomElementConstructor;
    function parseHTML(container: HTMLElement, str: unknown): HTMLElement;
    function withContainer(container: HTMLElement): (str: unknown) => HTMLElement;

    export { 
        BaseWebComponent,
        BaseWebComponentConstructor,
        OnConnected,
        OnDisconnected,
        OnAttributeChanged,
        OnAdopted,
        attachShadowDom,
        defineComponent,
        parseHTML,
        withContainer
    };    


}


declare module 'shared/jsx' {
    export const createElement: (tag, props, ...children) => HTMLElement;
    export const createFragment: (props, ...children) => HTMLElement;
    export const WC:  {
        createElement: (tag, props, ...children) => HTMLElement;
        createFragment: (props, ...children) => HTMLElement;
    }
}

type __HTMLElementTagNameMap = {
    [TAG in keyof HTMLElementTagNameMap] : HTMLElementTagNameMap[TAG]
}

