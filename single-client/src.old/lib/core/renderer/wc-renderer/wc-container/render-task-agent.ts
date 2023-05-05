

interface RenderSubject {
    render(): void;
}

export class RenderTaskAgent {
    protected readonly registeredRenderTimers = new Set<NodeJS.Timeout>();

    constructor(
        private subject: RenderSubject,
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