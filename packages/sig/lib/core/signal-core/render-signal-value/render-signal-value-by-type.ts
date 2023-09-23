import { SignalSubscriptionDetails, SignalSubscriptionType } from "../models";
import { renderSignalContent } from "./render-signal-content";
import { renderSignalProperty } from "./render-signal-property";

export function renderSignalValueByType(
    signalValue: unknown,
    sub: SignalSubscriptionDetails
): void {
    switch (sub.type) {
        case null:
        case SignalSubscriptionType.Content:
            return renderSignalContent(signalValue, sub);
        case SignalSubscriptionType.Property:
            return renderSignalProperty(signalValue, sub);
        case SignalSubscriptionType.Class:
            return renderSignalProperty(signalValue, sub);
        default:
            console.warn(`Unknown signal subscription type: ${sub.type}`);
    }
    
}