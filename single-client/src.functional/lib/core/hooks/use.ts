
import { RenderContext } from '../render-signal/render-context';
import { RenderSignal } from '../render-signal/render-signal';





function buildUsePromiseHook<V>(
  promise: Promise<V>, 
  onfulfilled: ((value: Awaited<V>, currentContext: RenderContext) => void | PromiseLike<void>), 
  onrejected: ((reason: any, currentContext: RenderContext) => void | PromiseLike<never>)
  ): Readonly<[V, null]> | Readonly<[null, Error]> {
  const currentContext = RenderSignal.instance.currentContext;
  const asyncEntry = currentContext.promisesStorage.get(promise);
  if (asyncEntry) {
    if (asyncEntry.state == 'fulfilled') {
      return [asyncEntry.value  as V, null];
    } else if (asyncEntry.state == 'rejected') {
      return [null, asyncEntry.value as Error];
    } else {
      return [null, null];
    }
  } else {
    currentContext.promisesStorage.set(promise, {
      state: 'pending',
      value: null,
    });
    Promise.resolve(promise)
      .then((v)=>onfulfilled(v, currentContext))
      .catch((e)=>onrejected(e, currentContext));
    return [null, null];
  }
}



export function useAsync<V>(promise: Promise<V>): Readonly<[V, null]> | Readonly<[null, Error]> {
  return buildUsePromiseHook(promise, 
    (v, currentContext) => {
      const currAsyncEntry = currentContext.promisesStorage.get(promise);
      currAsyncEntry.state = 'fulfilled';
      currAsyncEntry.value = v;
      currentContext.renderTaskAgent.registerTask();
    },
    (e, currentContext) => {
      const currAsyncEntry = currentContext.promisesStorage.get(promise);
      currAsyncEntry.state = 'rejected';
      currAsyncEntry.value = e;
    }
  );
}



export function useLazyAsync<V>(promise: Promise<V>): Readonly<[V, null]> | Readonly<[null, Error]> {
  return buildUsePromiseHook(promise, 
    (v, currentContext) => {
      const currAsyncEntry = currentContext.promisesStorage.get(promise);
      currAsyncEntry.state = 'fulfilled';
      currAsyncEntry.value = v;
    },
    (e, currentContext) => {
      const currAsyncEntry = currentContext.promisesStorage.get(promise);
      currAsyncEntry.state = 'rejected';
      currAsyncEntry.value = e;
    }
  );
}
