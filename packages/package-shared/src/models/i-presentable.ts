export interface IPresentable {
    buildStyle(props: unknown): string;
    buildTemplate(props: unknown, children: any[]): HTMLElement;
}