


class HistoryAdapter {

    protected _history: typeof window.history = window.history;
    protected _listeners: (() => void)[] = [];
    protected _currentLocation: string = window.location.pathname;

    protected _onPopState = () => {
        this._listeners.forEach((listener) => listener());
    }

    constructor() {
        this._history.pushState(null, '', this._currentLocation);
        window.addEventListener('popstate', this._onPopState);
    }


    get currentLocation() {
        return this._currentLocation;
    }

    pushState(state: any, title: string, url: string) {
        this._history.pushState(state, title, url);
        this._currentLocation = url;
    }

    replaceState(state: any, title: string, url: string) {
        this._history.replaceState(state, title, url);
        this._currentLocation = url;
    }

    go(delta: number) {
        this._history.go(delta);
    }

    addListener(listener: () => void) {
        this._listeners.push(listener);
    }

    removeListener(listener: () => void) {
        const index = this._listeners.findIndex((l) => l === listener);
        if (index > -1) {
            this._listeners.splice(index, 1);
        }
    }

    destroy() {
        window.removeEventListener('popstate', this._onPopState);
    }

}

class Router {

    _historyAdapter: HistoryAdapter;
    _routes: Route[] = [];
    _currentRoute: Route | null = null;

    _onPopState = () => {
        this._checkRoute();
    }

    constructor(historyAdapter: HistoryAdapter) {
        this._historyAdapter = historyAdapter;
        this._historyAdapter.addListener(this._onPopState);
    }

    addRoute(route: Route): Router {
        this._routes.push(route);
        return this
    }

    _checkRoute() {
        const currentLocation = this._historyAdapter.currentLocation;
        const route = this._routes.find((route) => route.match(currentLocation));
        if (route) {
            this._currentRoute = route;
            route.onMatch(currentLocation);
        }
    }

    destroy() {
        this._historyAdapter.removeListener(this._onPopState);
        this._historyAdapter.destroy();
    }

}

class Route {

    protected _path: string;
    protected _onMatch: (location: string) => void;

    constructor(path: string, onMatch: (location: string) => void) {
        this._path = path;
        this._onMatch = onMatch;
    }

    match(location: string) {
        return this._path === location;
    }

    onMatch(location: string) {
        this._onMatch(location);
    }
}   


const historyAdapter = new HistoryAdapter();

const router = new Router(historyAdapter);

router
    .addRoute(new Route(
        '/home', (location) => {
            console.log('home', location);
        }   
    ))
    .addRoute(new Route(
        '/about', (location) => {
            console.log('about', location);
        }
    ))
    .addRoute(new Route(
        '/contact', (location) => {
            console.log('contact', location);
        }
    ));