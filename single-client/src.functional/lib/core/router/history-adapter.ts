
export interface RouteStateChangeListener  {
    (state: any, location: string, history: typeof window.history): void;
}

export interface IHistoryAdapter {
    currentLocation: string
    state: unknown;
    pushState(url: string, state?: any, title?: string): void;
    replaceState(state: any, title: string, url: string): void;
    go(delta: number): void;
    addStateChangedListener(listener: RouteStateChangeListener) : void;
    removeStateChangeListener(listener: RouteStateChangeListener): void;
    destroy(): void;
}

export class HistoryAdapter implements IHistoryAdapter {

    protected _history: typeof window.history = window.history;
    protected _listeners: RouteStateChangeListener[] = [];
    protected _currentLocation: string = window.location.pathname;

    protected _onChangeState = () => {
        this._listeners.forEach((listener) => listener(this._history.state, this._currentLocation, this._history));
    }

    constructor() {
        this.pushState(this._currentLocation, null, '');
        window.addEventListener('popstate', this._onChangeState);
    }


    get currentLocation() {
        return this._currentLocation;
    }

    get state() {
        return this._history.state;
    }

    pushState(url: string, state?: any, title?: string) {
        this._history.state
        this._history.pushState(
            state || this._history.state, 
            title || document?.title, 
            url);
        this._currentLocation = url;
        this._onChangeState();
    }

    replaceState(state: any, title: string, url: string) {
        this._history.replaceState(state, title, url);
        this._currentLocation = url;
    }

    go(delta: number) {
        this._history.go(delta);
    }

    addStateChangedListener(listener: RouteStateChangeListener) {
        this._listeners.push(listener);
    }

    removeStateChangeListener(listener: RouteStateChangeListener) {
        const index = this._listeners.findIndex((l) => l === listener);
        if (index > -1) {
            this._listeners.splice(index, 1);
        }
    }

    destroy() {
        window.removeEventListener('popstate', this._onChangeState);
    }

}
