

export interface RenderContext {
    projectedState: {
        value?: any
        initialized: boolean;
    },
    stateHolder: Array<any>, 
    props: Record<any, any>;
    key: string;
}