

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
    class BaseWebComponent extends HTMLElement {
        public get outerContainer(): BaseWebComponent;
        public get childrenCollection(): HTMLCollection;
        public get classCollection(): DOMTokenList;
        public readonly shadow: ShadowRoot;
        public readonly styleElement: HTMLStyleElement;
        public readonly container: HTMLElement;
        constructor(containerElement?: JSX.Element);
        constructor(containerElementOrTag?: keyof HTMLElementTagNameMap | HTMLElement);
        protected appendToShadow(elem: HTMLElement): void;
        protected attachChildNodes(): void ;
    };

    export { 
        BaseWebComponent,
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

declare global {
    namespace JSX {
        interface IntrinsicElements extends __HTMLElementTagNameMap {

        }
    }
}