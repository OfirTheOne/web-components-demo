
declare namespace JSX {
    interface ElementClass extends BaseWebComponent { }
}



declare module 'shared/core' {
    interface IPresentable {
        buildStyle(props: unknown): string;
        buildTemplate(props: unknown, children: any[]): HTMLElement;
    }

    interface BaseWebComponentConstructor {
        new(...params: any[]): JSX.ElementClass;
    }
    class BaseWebComponent<S = any, P = any> extends HTMLElement, implements BaseWebComponentConstructor {
        abstract buildStyle(prop?: P): string;
        abstract buildTemplate(prop?: P): JSX.Element | HTMLElement | string;

        public readonly attr: S & { [key: string]: string };
        constructor();
        public get outerContainer(): BaseWebComponent;
        public get childrenCollection(): HTMLCollection;
        public get classCollection(): DOMTokenList;
        public readonly shadow: ShadowRoot;
        public readonly styleElement: HTMLStyleElement;
        public readonly container: HTMLElement;
        constructor(containerTag?: keyof HTMLElementTagNameMap, css?: string);
        protected appendToShadow(elem: HTMLElement): void;
        protected attachChildNodes(): void;
    };

    class WCContainer<S = any> {

        get host(): HTMLElement;
        public setPresentable(p: IPresentable): WCContainer;
        public setProps(props: any = {}): WCContainer;
        public setChildren(children: any[] = []): WCContainer;
        public render(): void;
    }

    declare class Presentable<P = any, S = any> implements IPresentable {
        public readonly attr: S;
        abstract buildStyle(props?: P): string;
        abstract buildTemplate(props?: P): any;
    }


    export {
        WCContainer,
        BaseWebComponent,
        BaseWebComponentConstructor,
        Presentable
    }
}

declare module 'shared/decorators' {
    function DefineComponent(
        name: string,
        options?: ElementDefinitionOptions & { shadow?: boolean }
    ): ClassDecorator;

    export {
        DefineComponent
    };
}

declare module 'shared/utils' {


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
    export const WC: {
        createElement: (tag, props, ...children) => HTMLElement;
        createFragment: (props, ...children) => HTMLElement;
    }
}