// export interface LazyStyleExport {
//   use(options: Record<string, any>): any;
//   unuse(): any;
// }

declare global {
  export namespace JSX {
    // export type ElementClass = Presentable
    export interface IntrinsicElements {
      [key: string]: any;
      // ...
    }
    export type Element = IntrinsicElements

  }

  declare module '*.lazy.css' {
    const style: {
      use(options: Record<string, any>): any;
      unuse(): any;
    };
    export default style;
  }
  declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.lazy.scss' {
    const style: {
      use(options: Record<string, any>): any;
      unuse(): any;
    };
    export default style;
  }
  declare module '*.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.styl' {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
