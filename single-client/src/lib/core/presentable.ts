import { IPresentable, SetState, LazyStyleExport } from "../models/i-presentable";

export interface Presentable<P extends Record<string, any> = any, S = any> extends IPresentable<P, S> {
    buildStyle?(props?: P): string | LazyStyleExport;
}
export abstract class Presentable<P extends Record<string, any> = any, S = any> implements IPresentable<P, S> {
    public readonly attr: S;
    constructor() { }
    abstract buildTemplate(props?: P, children?: JSX.Element[]): any;
    state: S;
    setState: SetState<S>;
}
