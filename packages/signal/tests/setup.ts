import {randomUUID} from 'node:crypto';
if(!window.crypto) window.crypto = {} as any;
window.crypto.randomUUID = randomUUID;

window.__SIG = window.__SIG || {
    signaledContextMemoryMap: new Map<string, unknown>(),
    signalIdsMemorySet: new Set<string>(),
};