import { IComponentContainer } from "../../../models/i-component-container";

export enum SignalType {
    // Null,
    Content,
    // Attribute,
    Property,
    Event,
    Style

}
export interface Signal {
    type: SignalType | null;
    propKey: string | null;
    componentKey: string;
    value: unknown;
    id: string;
    containerElement: HTMLElement | null;
    connected: boolean;
}

export function isSignal(s: unknown): s is Signal {
    return typeof s === 'object' 
        && s !== null 
        && ['id', 'componentKey', 'value', 'connected', 'containerElement'].every(key => key in s);
}

const generateId = () => {
    return 'randomUUID' in crypto ? crypto.randomUUID() : `${Math.random()}-${Date.now()}`;
}
export class SignalRenderContext {

    createSignalId() {
        return `signal-${this.signalStorage.size}--${generateId()}`;
    }

    signalStorage = new Map<string, Signal>;

    isValueAreSignalKey(value: unknown) {
        return typeof value === 'string' && this.signalStorage.has(value);
    }
    constructor(
        public componentContainerRef: IComponentContainer, 
        protected _componentKey: string
    ) {}

    get componentKey() {
        return this._componentKey;
    }



}


