
export interface SetState<S = any> {
  (state: S| ((cur: S) => Partial<S>)): Partial<S>;
}

export interface LazyStyleExport {
  use(options: Record<string, any>): any;
  unuse(): any;
}


export interface BuildStyle<P = any> {
  (props: P): string | LazyStyleExport;
}


export interface IPresentable<P = any, S = any> {
  buildStyle?(props?: P): string | LazyStyleExport;
  buildTemplate(props?: P, children?: JSX.Element[]): HTMLElement;
  state: S;
  setState: SetState;
}


export interface Presentable<P = any, S = any> extends IPresentable<P, S> {
  buildStyle?(props?: P): string | LazyStyleExport;
}
export abstract class Presentable<P extends Record<string, any> = any, S = any> implements IPresentable<P, S> {
  public readonly attr: S;
  constructor() { }
  // abstract buildStyle?(props?: P): string | LazyStyleExport;
  abstract buildTemplate(props?: P, children?: JSX.Element[]): any;
  state: S;
  setState: SetState<S>;
}

declare global {
  interface String {
    hello(): string;
  }

  export namespace JSX {
    export interface Element extends Presentable {}
    export interface ElementClass extends Presentable {

    }
    export interface IntrinsicElements {
      [key: string]: any;
      // ...
    }
  }

  declare module "*.lazy.css" {
    const style: { 
      use(options: Record<string, any>): any;
      unuse(): any;
     };
    export default style;
  }
  declare module "*.css" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.lazy.scss" {
    const style: { 
      use(options: Record<string, any>): any;
      unuse(): any;
     };
    export default style;
  }
  declare module "*.scss" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.module.sass" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.module.less" {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module "*.module.styl" {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};

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
