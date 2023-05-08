import { IComponentContainer } from "../../../models/i-component-container";
import { signalIdsMemorySet } from "../../global-storage";
import { DerivedSignal, Signal, SignalSubscription } from "../models";
import { renderSignalValue } from "../render-signal-value/render-signal-value";


export function isDerivedSignal(s: unknown): s is DerivedSignal {
    return typeof s === 'object'
        && s !== null
        && 'id' in s
        && 'value' in s
        && 'source' in s
        && 'transformers' in s;
}



export function isSignal(s: unknown): s is Signal {
    return typeof s === 'object' 
        && s !== null 
        && 'id' in s 
        && 'value' in s 
        && 'emitter' in s;
}

export function isValueAreSignalKey(value: unknown) {
    return typeof value === 'string' && signalIdsMemorySet.has(value);
}

export class SignalRenderContext {
    signalSubscription: Map<string, 
    {
        listener: () => void,
        subscription: SignalSubscription
    }[]> = new Map();

    signalsInUsed: Map<string, Signal> = new Map();

    subscribeSignal(signal: Signal | DerivedSignal, subscription: SignalSubscription) {
        const sourceSignal = isDerivedSignal(signal) ? signal.source : signal;

        sourceSignal.emitter.on('change', (value) => {
            let usedValue = value;
            if(isDerivedSignal(signal)) {
                usedValue = signal.computeValue();
            }
            renderSignalValue(usedValue, subscription);
        });
        this.signalsInUsed.set(sourceSignal.id, sourceSignal);
    }

    removeSignalSubscription(subscription: SignalSubscription) {
        if(this.signalSubscription.has(subscription.id)) {
            const subscriptions = this.signalSubscription.get(subscription.id);
            if(subscriptions) {
                const index = subscriptions.findIndex(s => s.subscription == subscription);
                if(index > -1) {
                    const signal = this.signalsInUsed.get(subscription.id);
                    signal?.emitter.removeListener('change', subscriptions[index].listener);
                    subscriptions.splice(index, 1);
                }
            }
        }
    }

    constructor(
        public componentContainerRef: IComponentContainer, 
        protected _componentKey: string
    ) {}

    get componentKey() {
        return this._componentKey;
    }
}


