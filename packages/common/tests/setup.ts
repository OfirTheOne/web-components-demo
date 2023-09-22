import {randomUUID} from 'node:crypto';
if(!window.crypto) window.crypto = {} as any;
window.crypto.randomUUID = randomUUID;