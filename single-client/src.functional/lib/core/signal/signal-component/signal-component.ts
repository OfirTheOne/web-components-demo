import { VirtualElementType } from "../../../models/virtual-element";

export function signal<T extends (...args: any[]) => unknown>(
    fn: T, 
): T {
    if(fn.name.length === 0) {
        throw new Error('Signal component must have a name');
    }
    const signalCom = function SignalComponent(...args: any[]) {
        return fn(...args);
    };
    signalCom['$$type'] =  Symbol.for(VirtualElementType.SignaledFunction);
    signalCom['__name__'] = fn.name;
    return signalCom as unknown as T;
}