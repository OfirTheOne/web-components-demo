import { IPresentable } from "../models/i-presentable";

export abstract class Presentable<P = any, S = any> implements IPresentable {
    public readonly attr: S;
    constructor() { }
    abstract buildStyle(props?: P): string ;
    abstract buildTemplate(props?: P): any;
}