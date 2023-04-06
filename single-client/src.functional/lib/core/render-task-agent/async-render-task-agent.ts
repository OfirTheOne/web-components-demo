import { IRenderTaskAgent, RenderTaskSubject } from "../../models/i-render-task-agent";


export class AsyncRenderTaskAgent implements IRenderTaskAgent{
    protected readonly registeredRenderTimers = new Set<NodeJS.Timeout>();

    constructor(
        private subject: RenderTaskSubject,
        private preRender: () => void = (() => {})
    ) { }

    public registerRender() {
        const timer = setTimeout(() => {
            this.registeredRenderTimers.delete(timer);
            this.registeredRenderTimers.forEach(registeredTimer => clearTimeout(registeredTimer));
            this.registeredRenderTimers.clear();
            this.preRender()
            this.subject.render();
        }, 0);
        this.registeredRenderTimers.add(timer)
    }
}



