// This file is used to store global data storage that are used in the entire project.

import { IRenderContext } from '../../models/i-render-context';
import { ProviderContextInstance } from '../state-core/provider-context/provider-context';

export const globalStyleMap = new Map<string, HTMLStyleElement>();
export const renderContextMemoryMap = new Map<string, IRenderContext>();
export const providerContextMemoryMap = new Map<string | symbol, ProviderContextInstance[]>();
export const signaledContextMemoryMap = new Map<string, Record<string, any>>();
export const signalIdsMemorySet = new Set<string>();


if(window && process.env.NODE_ENV !== 'production') {
    window['renderContextMemoryMap'] = renderContextMemoryMap;
    window['providerContextMemoryMap'] = providerContextMemoryMap;
    window['signaledContextMemoryMap'] = signaledContextMemoryMap;
    window['signalIdsMemorySet'] = signalIdsMemorySet;
}