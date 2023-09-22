

export * from './control-flow';
export * from './signal-subscription';

export * from './i-signal';
export * from './i-decorated-signal';
export * from './trackable';

export type AsyncFetcher<T, Args extends any[]> = (...args: Args | undefined) => Promise<T>;
export type SyncRun<Args extends any[]> = (...args: Args) => void;
export type ResourceStatus = 'pending' | 'success' | 'error';



