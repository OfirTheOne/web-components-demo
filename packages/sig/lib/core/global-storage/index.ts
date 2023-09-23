// This file is used to store global data storage that are used in the entire project.

import { SignalRenderContext } from '../signal-core/render-context/signal-render-context';
export const signaledContextMemoryMap = new Map<string, SignalRenderContext>();
export const signalIdsMemorySet = new Set<string>();


if(window && process.env.NODE_ENV !== 'production') {
    window['signaledContextMemoryMap'] = signaledContextMemoryMap;
    window['signalIdsMemorySet'] = signalIdsMemorySet;
}