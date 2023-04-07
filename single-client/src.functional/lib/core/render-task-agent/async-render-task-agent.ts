import { ITaskAgent } from "../../models/i-task-agent";

export class TaskAgent implements ITaskAgent {
    protected readonly registeredTaskTimers = new Set<NodeJS.Timeout>();

    constructor(private task: () => void = () => { }) { }

    public registerTask() {
        const timer = setTimeout(() => {
            this.registeredTaskTimers.delete(timer);
            this.registeredTaskTimers.forEach((registeredTimer) =>
                clearTimeout(registeredTimer)
            );
            this.registeredTaskTimers.clear();
            this.task();
        }, 0);
        this.registeredTaskTimers.add(timer);
    }
}
