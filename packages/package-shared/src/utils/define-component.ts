


export function defineComponent(
    name: string, 
    ctor: CustomElementConstructor, 
    options?: ElementDefinitionOptions | undefined
) {
    customElements.define(
        name,
        ctor,
        options
    );
    return ctor;
}
