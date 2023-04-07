export class Queue<T> {
    protected readonly queue: Array<T> = [];
    get length(): number {
        return this.queue.length;
    }
    push(item: T): number {
        return this.queue.push(item);
    }
    clear(): void {
        this.queue.length = 0;
    }
}

export class ActionQueue extends Queue<Function> {
    runAll(): void {
        this.queue.forEach((action) => action());
    }
}
