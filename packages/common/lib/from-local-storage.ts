import { Signal, createSignal } from "@sig/signal"


export const fromLocalStorage = (key: string): Signal<string> => {
    const [get, set] = createSignal(localStorage.getItem(key));
    const handler = (e: StorageEvent) => {
        if (e.storageArea !== localStorage) return;
        if (e.key === key || e.key === null) {
            set(e.newValue);
        }
    };
    window.addEventListener("storage", handler);
    get.onUnsubscribe.push(() => window.removeEventListener("storage", handler));
    return get;
}
