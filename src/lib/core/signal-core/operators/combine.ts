import { ISignal } from '@lib/core/signal-core';
import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";


export function combine(fn:(...args: any[]) => void, singals: ISignal[]): void {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if(!currentContext) {
        throw '';
    }
    if(fn && typeof fn === 'function') {
        currentContext.registeredHooks.onMount = fn;
    }
  }