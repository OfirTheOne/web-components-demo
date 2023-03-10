import { DefineComponentOptions } from "./define-component-options";

export interface WCContainerOptions extends Partial<Pick<
    DefineComponentOptions, 
    "shadow" | "renderOnce" | "noWrap"
>> {
}
