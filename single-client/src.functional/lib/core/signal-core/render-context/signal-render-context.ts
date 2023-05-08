import { IComponentContainer } from "../../../models/i-component-container";
import { signalIdsMemorySet } from "../../global-storage";
import { isDerivedSignal } from "../../utils/validators";
import { DerivedSignal, Signal, SignalSubscription } from "../models";
import { renderSignalValue } from "../render-signal-value/render-signal-value";



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
            const usedValue = isDerivedSignal(signal) ? signal.computeValue() : value;
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


