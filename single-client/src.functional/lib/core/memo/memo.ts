import { EqualFn } from "../../models/equal-fn";
import { VirtualElementType } from "../../models/virtual-element";


const defaultAreEqual = (prev: any, next: any) => {
    if(prev !== null && typeof prev === 'object' && next !== null &&  typeof next === 'object') {
        return Object.keys(prev).every(key => prev[key] === next[key]);
    } 
    return prev === next;
};

export function memo<T>(fn: () => T, areEqual?: EqualFn<T>): () => T;
export function memo<T, A>(fn: (a: A) => T, areEqual?: EqualFn<T>): (a: A) => T;
export function memo<T, A, B>(fn: (a: A, b: B) => T, areEqual?: EqualFn<T>): (a: A, b: B) => T;
export function memo<T>(
    fn: (...args: any[]) => T, 
    areEqual: EqualFn<T> = defaultAreEqual
): (...args: any[]) => T {
    if(fn.name.length === 0) {
        throw new Error('Memo component must have a name');
    }
    const memoComp = function MemoComponent(...args: any[]) {
        return fn(...args);
    };
    memoComp['$$type'] =  Symbol.for(VirtualElementType.MemoFunction);
    memoComp['__name__'] = fn.name;
    memoComp['_areEqual_'] = areEqual;
    return memoComp;
}

// export function memoize<T>(
//     fn: (...args: any[]) => T, 
//     areEqual: EqualFn<T> = (prev, next) => prev === next
//     ): (...args: any[]) => T {
//   let lastArgs: any[] | null = null;
//   let lastResult: T | null = null;
//   let calledOnce = false;
//   return (...args: any[]) => {
//     if (
//         calledOnce && 
//         lastArgs && 
//         args.length === lastArgs.length && 
//         args.every((value, index) => areEqual(value, lastArgs[index]))
//     ) {
//       return lastResult!;
//     }
//     calledOnce = true;
//     lastArgs = args;
//     lastResult = fn(...args);
//     return lastResult;
//   };
// }
