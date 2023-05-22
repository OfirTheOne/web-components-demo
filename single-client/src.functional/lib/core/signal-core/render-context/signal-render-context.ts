import { noop, removeDuplicationWithOrder } from "../../../common";
import { IComponentContainer } from "../../../models/i-component-container";
import { signalIdsMemorySet } from "../../global-storage";
import { isDecoratedSignal } from "../../utils/validators";
import { DerivedSignal, Signal, SignalSubscriptionDetails, Trackable } from "../models";
import { renderSignalValue } from "../render-signal-value/render-signal-value";

export function isValueAreSignalKey(value: unknown) {
    return typeof value === 'string' && signalIdsMemorySet.has(value);
}


interface SignalSubscription {
    listener: () => void;
    subscription: SignalSubscriptionDetails;
}

export class SignalRenderContext {
    mutationObserver: MutationObserver;
    elementSubscriptions: Map<HTMLElement | Node, SignalSubscription[]> = new Map();
    effectSubscription: Map<HTMLElement | Node, SignalSubscription[]> = new Map();
    signalsInUsed: Map<string, Signal> = new Map();

    registeredHooks = {
        onMount: noop
    }

    subscribeSignal(signal: Signal | DerivedSignal, subscription: SignalSubscriptionDetails) {
        const sourceSignal = isDecoratedSignal(signal) ? signal.source : signal;
        const listener = (value: unknown) => {
            const usedValue = isDecoratedSignal(signal) ? signal.computeValue() : value;
            renderSignalValue(usedValue, subscription);
        };
        sourceSignal.emitter.on('change', listener);        
        this.signalsInUsed.set(sourceSignal.id, sourceSignal);
    }

    removeAllElementSubscription(element: Node) {
        if(this.elementSubscriptions.has(element)) {
            const subscriptions = this.elementSubscriptions.get(element);
            if(subscriptions) {
                subscriptions.forEach((sub) => {
                    const signal = this.signalsInUsed.get(sub.subscription.id);
                    signal?.emitter.removeListener('change', sub.listener);
                });

            }
        }
    }

    registerEffect(effect: () => void, deps: Trackable[]) {
        const signals: Signal[] = removeDuplicationWithOrder(deps.map(dep => 'source' in dep ? dep.source : dep));
        signals.forEach(signal => {
            const emitter = signal.emitter;
            emitter.on('change', () => {
                effect();
            });
        });

    }

    constructor(
        public componentContainerRef: IComponentContainer, 
        protected _componentKey: string
    ) {
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node instanceof HTMLElement || node instanceof Text) {
                        // const subscriptionId = node.getAttribute('data-subscription-id');
                        this.removeAllElementSubscription(node);
                        // if (subscriptionId) {
                        // }
                    }
                });
            }, { childList: true });
        });
    }

    get componentKey() {
        return this._componentKey;
    }

    onMount(): void {
        try {
            this.registeredHooks.onMount();
        } catch (error) {
            // handle this
            console.log(error);
        }
    }
    onUnmount() {
        this.mutationObserver?.disconnect();
        this.elementSubscriptions.forEach((subscriptions) => {
            subscriptions.forEach((sub) => {
                const signal = this.signalsInUsed.get(sub.subscription.id);
                signal?.emitter.removeListener('change', sub.listener);
            });
        });
        this.elementSubscriptions.clear();
        this.signalsInUsed.clear();
    }
}


