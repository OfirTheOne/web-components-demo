
import { DefineComponentOptions } from "../models/define-component-options";
import { setDefineComponentArg } from "./accessors";

export function DefineComponent(
    name: string,
    options?: Omit<DefineComponentOptions, 'name'>
): ClassDecorator {
    return function (target) {
        setDefineComponentArg(name, options, target);
    }
}