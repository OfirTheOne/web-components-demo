

import { signal } from './create-signal';
import { DecoratedSignal } from '../models';

type AsyncFetcher<T, Args extends any[]> = (...args: Args | undefined) => Promise<T>;
type SyncRun<Args extends any[]> = (...args: Args) => void;
type ResourceStatus = 'pending' | 'success' | 'error';

export interface ResourceSignal<
    T = any, 
    Args extends any[] = any[], 
    F extends AsyncFetcher<T, Args> = AsyncFetcher<T, Args>,
> extends DecoratedSignal<T> {
    readonly fetcherRef: F;
    error: Error | null;
    status: ResourceStatus;
    run: SyncRun<Args>;
}

export const createResourceSignal = <T, Args extends any[] = any[], >(fetcher: AsyncFetcher<T, Args>) => {
    const createdResourceSignal = resourceSignal<T, Args>(fetcher);
    return [createdResourceSignal, createdResourceSignal.run] as const;
}

export const resourceSignal = <T, Args extends any[] = any[], >(fetcher: AsyncFetcher<T, Args>): ResourceSignal<T, Args> => {
    let status: ResourceStatus = 'pending';
    let error: Error;
    const source = signal(null as T);

    const run = (...args: Parameters<AsyncFetcher<T, Args>>) => {
        fetcher(...args).then((r) => {
            status = 'success';
            error = null;
            source.setValue(() => r);
        },
        (e) => {
            status = 'error';
            error = e;
            source.setValue(() => null);
        });
    };

    const resource: ResourceSignal<T, Args> = {
        get value() {
            return this.computeValue();
        },
        get id() {
            return source.id;
        },
        source,
        computeValue() {
            return source.value;
        },
        fetcherRef: fetcher,
        get error() {
            return error;
        },
        get status() {
            return status;
        },
        run
    };
    return resource;
}


