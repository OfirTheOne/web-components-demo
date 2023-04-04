

export class StateChangesQueue {
    protected readonly queue: Array<Function> = [];

    pushStateChange(state: Record<string, unknown>,assignedState: Record<string, unknown>): number {
        return this.push(
            () => Object.keys(assignedState)
                .forEach(key => state[key] = assignedState[key])
        );
    }    
    push(change: Function): number {
        return this.queue.push(change);
    }
    clear(): void {
        this.queue.length = 0;
    }
    runChanges(): void {
        this.queue.forEach(change => change());
    }
}