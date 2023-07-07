
interface Store<S> {
    getState(): S;
    setState(state: S): void;
    subscribe(listener: (state: S) => void): () => void;
}

type SetState<S> = (state: Partial<S> | ((curr: S) => Partial<S>)) => void;
type GetState<S> = () => S

interface CreateStateFactory<S> {
    (set: SetState<S>, get: GetState<S>): S
}

export const createStore = <S>(factory: CreateStateFactory<S>): Store<S> => {
    let state: S;
    let listeners: Array<(state: S) => void> = [];
    const setState: SetState<S> = (newState) => {
        state = {
            ...(state || {} as S),
            ... ((typeof newState === 'function' ? newState(state) : newState) || {}) as S,
        };
        listeners.forEach((listener) => {
            listener(state);
        });
    };
    const getState: GetState<S> = () => {
        return state;
    };
    const subscribe = (listener: (state: S) => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    };
    const initialState = factory(setState, getState);
    setState(initialState);
    return {
        getState,
        setState,
        subscribe
    };
}