import { ISignal, createSignal } from "@sigjs/signal"


export const fromLocalStorage = (key: string): ISignal<string> => {
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
