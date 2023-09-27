
export enum SignalSubscriptionType {
    // Null,
    ControlFlow,
    Effect,
    Content,
    Property,
    Event,
    Style,
    Class

}
export interface SignalSubscriptionDetails {
    type: SignalSubscriptionType | null;
    propKey: string | null;
    componentKey: string;
    signalId: string;   
    id: string;
    containerElement: HTMLElement | Element | Text| null;
    connected: boolean;
}