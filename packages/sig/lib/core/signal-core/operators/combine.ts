import { ISignal } from '@/core/signal-core';
import { SignalRenderContextCommunicator } from "../render-context/signal-render-context-communicator";


export function combine(fn:(...args: any[]) => void, _singals: ISignal[]): void {
    const currentContext = SignalRenderContextCommunicator.instance.currentContext;
    if(!currentContext) {
        throw '';
    }
    if(fn && typeof fn === 'function') {
        currentContext.registeredHooks.onMount = fn;
    }
  }