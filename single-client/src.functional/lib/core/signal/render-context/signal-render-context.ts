import { IComponentContainer } from "../../../models/i-component-container";
import { signalIdsMemorySet } from "../../global-storage";
import { Signal, SignalSubscription } from "../models";
import { renderSignalValue } from "../render-signal-value/render-signal-value";

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

    // createSignalId() {
    //     return `signal-${signalIdsMemorySet.size}--${generateId()}`;
    // }
    // signalStorage = new Map<string, Signal>;


    signalSubscription: Map<string, 
    {
        listener: () => void,
        subscription: SignalSubscription
    }[]> = new Map();


    signalsInUsed: Map<string, Signal> = new Map();

    

    subscribeSignal(signal: Signal, subscription: SignalSubscription) {
        signal.emitter.on('change', (value) => {
            renderSignalValue(value, subscription);
        });

        this.signalsInUsed.set(signal.id, signal);
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

    // updateSignalSubscription(signalId: string) {
    //     if(this.signalSubscription.has(signalId)) {
    //         const subscriptions = this.signalSubscription.get(signalId);
    //         if(subscriptions) {
    //             subscriptions.forEach(subscription => {
    //                 renderSignalValue(subscription);
    //             });
    //         }
    //     }
    // }

    constructor(
        public componentContainerRef: IComponentContainer, 
        protected _componentKey: string
    ) {}

    get componentKey() {
        return this._componentKey;
    }



}


