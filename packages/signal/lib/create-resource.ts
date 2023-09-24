

import { Signal } from './create-signal';
import { AsyncFetcher, ResourceStatus, SyncRun } from './types/resource';
import { DecoratedSignal } from './decorated-signal';


export const createResourceSignal = <T, Args extends any[] = any[], >(fetcher: AsyncFetcher<T, Args>) => {
    const createdResourceSignal = resourceSignal<T, Args>(fetcher);
    return [createdResourceSignal, createdResourceSignal.run.bind(createdResourceSignal)] as const;
}

export const resourceSignal = <T, Args extends any[] = any[]>(fetcher: AsyncFetcher<T, Args>): ResourceSignal<T, Args> => {
    const resource = new ResourceSignal<T, Args>(fetcher) ;
    return resource;
}

export class ResourceSignal<T, Args extends any[] = any[]> extends DecoratedSignal<T> {
    _error: Error | null;
    _status: ResourceStatus;
    get error() {
        return this._error;
    }
    get status() {
        return this._status;
    }
    readonly run: SyncRun<Args>;

    constructor(protected fetcher: AsyncFetcher<T, Args>) {
        super(new Signal(null as T));
        this.run = (...args: Parameters<AsyncFetcher<T, Args>>) => {
            fetcher(...args).then((r) => {
                this._status = 'success';
                this._error = null;
                this.source.setValue(() => r);
            },
            (e) => {
                this._status = 'error';
                this._error = e;
                this.source.setValue(() => null);
            });
        };
    }

}
