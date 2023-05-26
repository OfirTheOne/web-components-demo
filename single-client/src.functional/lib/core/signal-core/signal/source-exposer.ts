import { ISignal } from "../models";

export class SourceExposer {
    _s: ISignal;
    set(s: ISignal) {
        this._s = s;
    }
    get(): ISignal {
        return this._s;
    }
}