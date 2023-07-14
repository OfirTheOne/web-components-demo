import { IHistoryAdapter, RouteStateChangeListener } from "./history-adapter";
import { PathMatcherResult } from "./path-matcher/path-matcher";
import { Route } from "./route";


const returnFirst = <T, R = T>(
    list: Array<T>, 
        condition: (
            item: T, 
            returnValue: ((val: R) => void)
        ) => boolean
    ): R | undefined => {

    let value = undefined  as R | undefined;
    const returnValue = (val: R) => {   
        value = val;
    };
    const matched = list.some((item) => {
        return condition(item, returnValue);
    });
    if (matched) {
        return value;
    }
};

export class Router {

    protected _historyAdapter: IHistoryAdapter;
    protected _routes: Route[] = [];
    protected _currentRoute: Route | null = null;
    protected _currentParams: Record<string, string> = {};

    protected _checkRoute(currentLocation: string, state: unknown) {
        const pathMatcherResult =  returnFirst<Route, [PathMatcherResult, Route]>(this._routes, (route, returnValue) => {
            const matchResult = route.match(currentLocation);
            if (matchResult.matched) {
                returnValue([matchResult, route]);
                return true;
            }
            return false;
        });
        if (pathMatcherResult) {
            const [matchResult, route] = pathMatcherResult;
            if(this._currentRoute && 
                this._currentRoute !== route && 
                this._currentRoute.shouldListenToUnMatch) {
                this._currentRoute.onUnMatch(currentLocation, {}, state);
            }
            this._currentRoute = route;
            this._currentParams = matchResult.params;
            route.onMatch(currentLocation, matchResult.params, state);
        }
    }
    protected _onStateChanged: RouteStateChangeListener = (state, location) => {
        this._checkRoute(location, state);
    }

    get currentLocation() {
        return this._historyAdapter.currentLocation;
    }

    constructor(historyAdapter: IHistoryAdapter) {
        this._historyAdapter = historyAdapter;
        this._historyAdapter.addStateChangedListener(this._onStateChanged);
    }

    addRoute(route: Route): Router {
        this._routes.push(route);
        this._checkRoute(this._historyAdapter.currentLocation, this._historyAdapter.state);
        return this
    }

    destroy() {
        this._historyAdapter.removeStateChangeListener(this._onStateChanged);
        this._historyAdapter.destroy();
    }
}