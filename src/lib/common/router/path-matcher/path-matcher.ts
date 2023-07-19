
export interface PathMatcherResult {
    matched: boolean;
    params: Record<string, string>;
}

export abstract class PathMatcher {
    protected _path: string;

    constructor(path: string) {
        this._path = path;
    }

    abstract match(location: string): PathMatcherResult;
}