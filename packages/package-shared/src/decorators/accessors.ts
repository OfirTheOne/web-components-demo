import "reflect-metadata";
import { DEFINE_COMPONENT_ARGS } from "../constants";
import { DefineComponentOptions } from "shared/decorators";

export function setDefineComponentArg(name: string, options: DefineComponentOptions = {}, target: Object) {
    Reflect.defineMetadata(
        DEFINE_COMPONENT_ARGS, 
        { name, options }, 
        target
    );
}   

export function getDefineComponentArg(target: Object): {
    name: string, 
    options: DefineComponentOptions 
 } | undefined {
    return Reflect.getMetadata(
        DEFINE_COMPONENT_ARGS, 
        target
    );
}  