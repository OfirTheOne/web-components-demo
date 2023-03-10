
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


declare global {
    
    interface String {
        hello(): string;
    }

    export namespace JSX {
        export interface Element extends IPresentable {}
        export interface ElementClass extends Presentable { }
        export interface IntrinsicElements {
          [key: string]: any;
          // ...
        }
      }

}

export { }

/*

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


declare module 'shared/core' {

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

*/