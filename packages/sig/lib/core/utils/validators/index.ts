export * from './is-element-of-type';
export * from './is-render-text-primitive';
export * from './is-dynamic-template';



export function isAllLowerCase(str: string) {
    return str === str.toLowerCase();
}

export function isArrayShallowEqual<T = unknown>(a: T[], b: T[]): boolean {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

