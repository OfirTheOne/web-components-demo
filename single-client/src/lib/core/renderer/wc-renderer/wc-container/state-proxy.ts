

const isProxySymbol = Symbol('isProxy');

const getStateHandler: <T extends Record<string | symbol, unknown>>() => ProxyHandler<T> = () => ({
    get(target, key) {
        if (key === isProxySymbol) {
            return true;
        }
        const prop = target[key];
        if (typeof prop == 'undefined') {
            return;
        }
        if (!prop[isProxySymbol] && typeof prop === 'object') {
            (<Record<string | symbol, unknown>>target)[key] = new Proxy(prop, getStateHandler());
        }
        return target[key];
    },
    set(_target, _key, _value) {
        return true;
    }
});

export class StateProxy {
    static create<T extends Record<string, unknown>>(state: T): T {
        return new Proxy(state, getStateHandler());
    }
}