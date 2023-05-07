import { FC } from "../../../models/functional-component";
import { VirtualFnComponent } from "../../../models/virtual-fn-component";

import { VirtualElementType } from "../../../models/virtual-element";
// import { isDynamicTemplate } from "../../utils/validators/is-dynamic-template";

export function signalComponent<T extends FC>(
    fn: T, 
): T {
    if(fn.name.length === 0) {
        throw new Error('Signal component must have a name');
    }
    const signalCom = function SignalComponent(p: object, children: JSX.Element) {
        return fn(p, children);
    };
    signalCom['$$dynamic-template'] = fn['$$dynamic-template'];
    // if(isDynamicTemplate(fn as unknown as VirtualFnComponent)) {
    // }
    signalCom['$$type'] =  Symbol.for(VirtualElementType.SignaledFunction);
    signalCom['__name__'] = fn.name;
    return signalCom as unknown as T;
}