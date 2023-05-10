import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { ControlFlow } from '../../signal-core/models';

export function isControlFlow(tag: VirtualFnComponent): boolean {
    return (
        typeof tag === 'function' 
        && tag['$$control-flow'] 
        && Object.values(ControlFlow)
            .map((dynamicTemplateKey) => Symbol.for(dynamicTemplateKey))
            .includes(tag['$$control-flow'])
    );
}
