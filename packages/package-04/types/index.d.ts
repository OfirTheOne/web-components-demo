
declare module 'wc-jsx' {
    export const WC: {
        createElement: (tag, props, ...children) => HTMLElement;
        createFragment: (props, ...children) => HTMLElement;
    }
    export const createElement: (tag, props, ...children) => HTMLElement;
    export const createFragment: (props, ...children) => HTMLElement;
}