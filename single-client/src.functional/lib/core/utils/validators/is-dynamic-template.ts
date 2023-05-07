import { VirtualFnComponent } from '../../../models/virtual-fn-component';
import { DynamicTemplate } from '../../signal-core/models';

export function isDynamicTemplate(tag: VirtualFnComponent): boolean {
    return (
        typeof tag === 'function' 
        && tag['$$dynamic-template'] 
        && Object.values(DynamicTemplate)
            .map((dynamicTemplateKey) => Symbol.for(dynamicTemplateKey))
            .includes(tag['$$dynamic-template'])
    );
}
