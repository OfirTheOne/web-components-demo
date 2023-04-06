




export interface RenderTaskSubject {
    render(): void;
}


export interface IRenderTaskAgent {
    registerRender(): void;
}