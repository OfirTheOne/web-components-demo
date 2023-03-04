/// <reference  types="../src/models/index.ts"/>


interface DefineComponentOptions extends ElementDefinitionOptions {
    shadow?: boolean;
    renderOnce?: boolean;
    noWrap?: boolean;
}


interface WCContainerOptions extends Partial<Pick<
    DefineComponentOptions, 
    "shadow" | "renderOnce" | "noWrap"
>> {
}

declare namespace JSX {
    interface ElementClass extends BaseWebComponent { }
}

declare module 'shared/core' {
    interface IPresentable {
        buildStyle(props: unknown): string;
        buildTemplate(props: unknown, children: any[]): HTMLElement;
    }


    declare class Presentable<P = any, S = any> implements IPresentable {
        public readonly attr: S;
        abstract buildStyle(props?: P): string;
        abstract buildTemplate(props?: P, children: any[] = []): any;
        state: S;
        setState: (state: S| ((cur: S) => Partial<S>)) => Partial<S>;
    }

    function render(vElem: VirtualElement, id: string): void;

    export {
        Presentable,
        render
    }
}

declare module 'shared/decorators' {
    function DefineComponent(
        name: string,
        options?: DefineComponentOptions,
    ): ClassDecorator;

    export {
        DefineComponentOptions,
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

    interface OnPreRender {
        preRender(): void
    }
    interface OnPostRender {
        postRender(): void;
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
        OnPreRender,
        OnPostRender,
        WCContainerOptions,
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