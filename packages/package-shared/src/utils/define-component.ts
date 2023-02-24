import { Ctor } from "../models/ctor";



export function defineComponent(
    name: string, 
    ctor: Ctor<any>, 
    options?: ElementDefinitionOptions | undefined
) {
    customElements.define(
        name,
        ctor,
        options
    );
    return ctor;
}
