import { CreateStateFactory, Store, SetState, GetState } from "./types";


export const createStore = <S extends object>(factory: CreateStateFactory<S>): Store<S> => {
    let state: S | undefined = undefined;
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
    const reset = (): void => {
        state = undefined;
        const initialState = factory(setState, getState);
        setState(initialState);
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
        reset,
        getState,
        setState,
        subscribe
    };
};