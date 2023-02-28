
import { DefineComponentOptions } from "shared/decorators";
import { setDefineComponentArg } from "./accessors";

export function DefineComponent(
    name: string,
    options?: Omit<DefineComponentOptions, 'name'>
): ClassDecorator {
    return function (target) {
        setDefineComponentArg(name, options, target);
    }
}