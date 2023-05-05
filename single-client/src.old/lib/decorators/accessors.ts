import "reflect-metadata";
import { DEFINE_COMPONENT_ARGS } from "../constants";
import { DefineComponentOptions } from "../models/define-component-options";

export function setDefineComponentArg(name: string, options: DefineComponentOptions = {}, target: object) {
    Reflect.defineMetadata(
        DEFINE_COMPONENT_ARGS, 
        { name, options }, 
        target
    );
}   

export function getDefineComponentArg(target: object): {
    name: string, 
    options: DefineComponentOptions 
 } | undefined {
    return Reflect.getMetadata(
        DEFINE_COMPONENT_ARGS, 
        target
    );
}  