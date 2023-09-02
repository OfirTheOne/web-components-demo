
export interface Store<S extends object> {
    reset(): void;
    getState(): S;
    setState(state: S): void;
    subscribe(listener: (state: S) => void): () => void;
}

export type SetState<S> = (state: Partial<S> | ((curr: S) => Partial<S>)) => void;
export type GetState<S> = () => S

export interface CreateStateFactory<S extends object> {
    (set: SetState<S>, get: GetState<S>): S
}
