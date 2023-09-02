import { FC } from "../../../models/functional-component";
import { VirtualElementType } from "../../../models/virtual-element";

export function signalComponent<T extends FC<any>>(
    fn: T, 
): T {
    if(fn.name.length === 0) {
        throw new Error('Signal component must have a name');
    }
    const signalCom = function SignalComponent(p: object, children: JSX.Element) {
        return fn(p, children);
    };
    signalCom['$$control-flow'] = fn['$$control-flow'];
    signalCom['$$type'] =  Symbol.for(VirtualElementType.SignaledFunction);
    signalCom['__name__'] = fn.name;
    return signalCom as unknown as T;
}