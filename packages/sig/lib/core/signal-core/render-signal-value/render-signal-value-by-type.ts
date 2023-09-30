import { SignalSubscriptionType, RenderSignalValueHandler } from "../models";
import { renderSignalContent } from "./render-signal-content";
import { renderSignalProperty } from "./render-signal-property";
import { renderSignalClassToggle, renderSignalClassReplace } from "./render-signal-class";
import { renderSignalStyle } from "./render-signal-style";


const handlerMap: Partial<Record<SignalSubscriptionType, RenderSignalValueHandler>> = {
    [SignalSubscriptionType.Content]: renderSignalContent,
    [SignalSubscriptionType.Property]: renderSignalProperty,
    [SignalSubscriptionType.ClassToggle]: renderSignalClassToggle,
    [SignalSubscriptionType.ClassReplace]: renderSignalClassReplace,
    [SignalSubscriptionType.Style]: renderSignalStyle,
}


export const renderSignalValueByType: RenderSignalValueHandler = (signalValue, prevValue, sub): void => {
    if(sub.type in handlerMap) {
        handlerMap[sub.type](signalValue, prevValue, sub);
    } else {
        console.warn(`Unknown signal subscription type: ${sub.type}`);
    }
}