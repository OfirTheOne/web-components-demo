
import { Signal, createSignal } from "@sigjs/signal"

export function fromEvent<T extends globalThis.Event = Event, V = T>(
    target: EventTarget,
    type: string,
    options: AddEventListenerOptions | undefined,
    map: (e: T) => V): Signal<V>;
export function fromEvent<T extends globalThis.Event = Event, V = T>(
    target: EventTarget,
    type: string,
    options?: AddEventListenerOptions): Signal<T>;
export function fromEvent<T extends globalThis.Event = Event, V = T>(
    target: EventTarget,
    type: string,
    options?: AddEventListenerOptions,
    map?: (e: T) => V): Signal<T | V> {
    const [get, set] = createSignal<V | T>(null as unknown as V);

    const handler = (map ?
        ((e: T) => { set(map(e)) }) :
        ((e: T) => { set(e) }) 
    ) as EventListener;
    target.addEventListener(type, handler, options);
    get.onUnsubscribe.push(() => target.removeEventListener(type, handler, options));
    return get;
}