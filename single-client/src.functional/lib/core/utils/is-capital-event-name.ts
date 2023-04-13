type CapitalEventName = `on${Capitalize<keyof HTMLElementEventMap>}`;

export function isCapitalEventName(evName: string): evName is CapitalEventName {
    return evName.startsWith('on') && evName.toLowerCase() in window;
}
