import { noop, removeDuplicationWithOrder } from "../../../common/utils";
import { IComponentContainer } from "../../../models/i-component-container";
import { signalIdsMemorySet } from "../../global-storage";
import { IDecoratedSignal, ISignal, SignalSubscriptionDetails, Trackable } from "../models";
import { renderSignalValueByType } from "../render-signal-value/render-signal-value-by-type";

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
    signalsInUsed: Map<string, ISignal | IDecoratedSignal> = new Map();

    renderedPartition: number | string | null;

    controlledPartitionsSubs: Map< 
            string | number | null, // name or index of partition
            {
                active: boolean,
                listeners: Map< 
                    string, // signal id
                    ((value: unknown) => void)[] // array of listeners
                >
            }
    > = new Map();
    

    registeredHooks = {
        onMount: noop,
        onUnmount: noop
    }

    addSubscription(partition: string | number | null, sid: string, listener: (value: unknown) => void) {
        if(!this.controlledPartitionsSubs.has(partition)) {
            this.controlledPartitionsSubs.set(partition, { active: true, listeners: new Map() });
        }
        const partitionEntry = this.controlledPartitionsSubs.get(partition);
        if(partitionEntry) {
            if(!partitionEntry.listeners.has(sid)) {
                partitionEntry.listeners.set(sid, []);
            }   
        }
        const listeners = partitionEntry.listeners.get(sid);
        listeners?.push(listener);
    }

    subscribeSignal(signal: ISignal | IDecoratedSignal, subscription: SignalSubscriptionDetails) {
        const subscribableSignal = signal;
        let lastValue = null;
        const listener = (value: unknown) => {
            if(lastValue !== value) {
                lastValue = value;
                renderSignalValueByType(value, subscription);
            }
        };
        subscribableSignal.subscribe(listener);     
        this.signalsInUsed.set(subscribableSignal.id, subscribableSignal);
        this.addSubscription(this.renderedPartition, subscribableSignal.id, listener)           
    }

    registerEffect(effect: () => void, deps: Trackable[]) {
        const signals: ISignal[] = removeDuplicationWithOrder(deps.map(dep => 'source' in dep ? dep.source : dep));
        signals.forEach(signal => {
            signal.subscribe(() => {
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
                        // this.componentContainerRef.
                        // const subscriptionId = node.getAttribute('data-subscription-id');
                        // if (subscriptionId) {
                        // }
                    }
                });
            }, { childList: true,  });
        });
        if(this.componentContainerRef.parent) {
            this.mutationObserver.observe(this.componentContainerRef.parent, { childList: true })
        }
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
        this.registeredHooks.onUnmount()
        this.mutationObserver?.disconnect();
        this.elementSubscriptions.forEach((subscriptions) => {
            subscriptions.forEach((sub) => {
                const signal = this.signalsInUsed.get(sub.subscription.id);
                signal?.unsubscribe(sub.listener);
            });
        });
        this.elementSubscriptions.clear();
        this.signalsInUsed.clear();
    }
}



