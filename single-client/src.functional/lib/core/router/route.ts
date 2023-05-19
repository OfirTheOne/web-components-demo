


import { PathMatcher, PathMatcherResult } from "./path-matcher/path-matcher";
import { PTRPathMatcher } from "./path-matcher/ptr-path-matcher";
import { RouteMatchListener } from "./route-match-listener";

export class Route extends PathMatcher {

    matchStrategy: PathMatcher;
    protected _path: string;
    protected _onMatch: RouteMatchListener;
    protected _onUnMatch: RouteMatchListener;

    get shouldListenToUnMatch() {
        return !!this._onUnMatch;
    }
    constructor(
        path: string, 
        onMatch: RouteMatchListener,
        onUnMatch?: RouteMatchListener) {
        super(path);
        this._path = path;
        this._onMatch = onMatch;
        this._onUnMatch = onUnMatch;
        this.matchStrategy = new PTRPathMatcher(path);
    }

    match(location: string): PathMatcherResult {
        return this.matchStrategy.match(location);
    }

    onMatch(...args: Parameters<RouteMatchListener>) {
        this._onMatch(...args);
    }

    onUnMatch(...args: Parameters<RouteMatchListener>) {
        this._onUnMatch?.(...args);
    }
}   