export type AsyncFetcher<T, Args extends any[]> = (...args: Args | undefined) => Promise<T>;
export type SyncRun<Args extends any[]> = (...args: Args) => void;
export type ResourceStatus = 'pending' | 'success' | 'error';

