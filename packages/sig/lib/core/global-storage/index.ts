// This file is used to store global data storage that are used in the entire project.

import { SignalRenderContext } from '../signal-core/render-context/signal-render-context';

// declare global {
//     interface Window {
//         __SIG: {
//             signaledContextMemoryMap: Map<string, SignalRenderContext>,
//             signalIdsMemorySet: Set<string>,
//         }
//     }
// }

window.__SIG = window.__SIG || {
    signaledContextMemoryMap: new Map<string, SignalRenderContext>(),
    signalIdsMemorySet: new Set<string>(),
};

export const signaledContextMemoryMap = window.__SIG['signaledContextMemoryMap'];
export const signalIdsMemorySet = window.__SIG['signalIdsMemorySet'];
