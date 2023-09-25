import { noop, removeDuplicationWithOrder } from "../../../common/utils";
import { IComponentContainer } from "../../../models/i-component-container";
import { SignalComponentContainer } from "../../component-container/signal-component-container";
import { SignalSubscriptionDetails } from "../models";
import { IDecoratedSignal, ISignal, Trackable } from "../signal";

import { renderSignalValueByType } from "../render-signal-value/render-signal-value-by-type";


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
    lifeCycle = {
        onMount: noop,
        onUnmount: noop,
        onDispose: noop
    }

    subscribeSignal(signal: ISignal | IDecoratedSignal, subscription: SignalSubscriptionDetails) {
        const subscribableSignal = signal;
        let lastValue = null;
        const listener = (value: unknown) => {
            if (lastValue !== value) {
                lastValue = value;
                renderSignalValueByType(value, subscription);
            }
        };
        subscribableSignal.subscribe(listener);
        this.signalsInUsed.set(subscribableSignal.id, subscribableSignal);
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
        if (componentContainerRef instanceof SignalComponentContainer) {
            this.mutationObserver = new MutationObserver((_mutations) => {
                /*
                mutations.forEach((mutation) => {
                    let shouldCallUnmount = false;
                    for(const node of mutation.removedNodes)  {
                        if (node instanceof HTMLElement || node instanceof Text) {
                            if(Array.isArray(componentContainerRef.container)) {
                                if(componentContainerRef.container.includes(<HTMLElement>node)) {
                                    shouldCallUnmount = true;
                                }
                            } else if(componentContainerRef.container === node) {
                                shouldCallUnmount = true;
                            }
                            if(shouldCallUnmount) {
                                alert('unmounting');
                                try {
                                    // componentContainerRef.onMount(); 
                                } catch (error) {
                                    console.log(error); 
                                }
                                break;
                            }
                        }
                    }
                }, { childList: true, });
                */
            });
            if (this.componentContainerRef.parent) {
                this.mutationObserver.observe(this.componentContainerRef.parent, { childList: true })
            }
        }
    }

    get componentKey() {
        return this._componentKey;
    }

    onDispose(): void {
        try {
            this.lifeCycle.onDispose();
            this.elementSubscriptions.forEach((subscriptions) => {
                subscriptions.forEach((sub) => {
                    const signal = this.signalsInUsed.get(sub.subscription.id);
                    signal?.unsubscribe(sub.listener);
                });
            });
            this.elementSubscriptions.clear();
            this.signalsInUsed.clear();

        } catch (error) {
            // handle this
            console.log(error);
        }
    }

    onMount(): void {
        try {
            this.elementSubscriptions.forEach((subscriptions) => {
                subscriptions.forEach((sub) => {
                    sub.subscription.connected = true;
                });
            });
        } catch (error) {
            console.log(error);
        }
        try {
            this.lifeCycle.onMount();
        } catch (error) {
            console.log(error);
        }
    }

    onUnmount() {
        this.lifeCycle.onUnmount();
        // this.mutationObserver?.disconnect();
        this.elementSubscriptions.forEach((subscriptions) => {
            subscriptions.forEach((sub) => {
                sub.subscription.connected = false;
            });
        });
    }
}