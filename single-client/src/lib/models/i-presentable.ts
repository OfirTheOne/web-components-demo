export interface IPresentable<P = any, S = any> {
    buildStyle(props: P): string;
    buildTemplate(props: P, children: any[]): HTMLElement;
    state: S;
    setState: (state: S | ((cur: S) => Partial<S>)) => Partial<S>
}