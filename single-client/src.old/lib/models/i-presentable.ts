
export interface SetState<S = any> {
    (state: S| ((cur: S) => Partial<S>)): Partial<S>;
}

export interface LazyStyleExport {
    use(options: Record<string, any>): any;
    unuse(): any;
}


export interface BuildStyle<P = any> {
    (props: P): string | LazyStyleExport;

}


export interface IPresentable<P = any, S = any> {
    buildStyle?(props?: P): string | LazyStyleExport;
    buildTemplate(props?: P, children?: JSX.Element[]): HTMLElement;
    state: S;
    setState: SetState;
}