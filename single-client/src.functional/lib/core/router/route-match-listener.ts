
export interface RouteMatchListener {
    (location: string, params: Record<string, string>, state: unknown ): void;
}