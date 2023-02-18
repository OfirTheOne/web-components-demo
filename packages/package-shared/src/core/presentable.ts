import { IPresentable } from "../models/i-presentable";

export abstract class Presentable<S = any> implements IPresentable {
    public readonly attr: S;
    constructor() { }
    abstract buildStyle(props?: unknown): string ;
    abstract buildTemplate(props?: unknown): any;
}