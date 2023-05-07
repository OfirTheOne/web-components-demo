import { FnComponent } from '../../../models/fn-component';
import { DynamicTemplate } from '../../signal/models';

export function isDynamicTemplate(tag: FnComponent): boolean {
    return (
        typeof tag === 'function' 
        && tag['$$dynamic-template'] 
        && Object.values(DynamicTemplate)
            .map((dynamicTemplateKey) => Symbol.for(dynamicTemplateKey))
            .includes(tag['$$dynamic-template'])
    );
}
