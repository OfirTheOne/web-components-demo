import * as ptr  from 'path-to-regexp/dist';
import { PathMatcher, PathMatcherResult } from './path-matcher';

export class PTRPathMatcher extends PathMatcher {
    protected keys = [];
    protected pathRe: RegExp;

    constructor(path: string) {
        super(path);
        this._path = path;
        this.pathRe = ptr.pathToRegexp(this._path, this.keys);
    }
    
    match(location: string): PathMatcherResult {
        const matchResult = this.pathRe.exec(location);
        if (matchResult) {

            const params = this.keys.length ? matchResult.reduce((accParams, item, i) => {
                accParams[this.keys[i - 1].name] = item;
                return accParams;
            }, {} as Record<string, string>) : {};

            return { matched: true, params };
        } else {
            return { matched: false, params: {} };
        }
    }
}
