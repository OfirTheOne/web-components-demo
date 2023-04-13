import { Queue } from '../../common/queue';

export class ActionQueue extends Queue<() => void> {
    runAll(): void {
        this.queue.forEach((action) => action());
    }
}
