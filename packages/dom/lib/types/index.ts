export type DomCompatibleElement = Text | HTMLElement | Element | Node;

export type DomElement = Text | HTMLElement | Element | Node;

export type OneOrMany<T> = T | T[];

export type Ctor<T> = new (...args: unknown[]) => T;

export type EventHandlerName = `on${Capitalize<keyof HTMLElementEventMap>}`;
