export const isCallback = (maybeFunction: unknown): maybeFunction is (...args: any[]) => any =>
    typeof maybeFunction === 'function'