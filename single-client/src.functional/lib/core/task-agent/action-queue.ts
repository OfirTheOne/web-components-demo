import { Queue } from "../../common/queue";

export class ActionQueue extends Queue<Function> {
    runAll(): void {
        this.queue.forEach((action) => action());
    }
}
