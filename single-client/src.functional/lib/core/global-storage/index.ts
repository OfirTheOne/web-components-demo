
// This file is used to store global data storage that are used in the entire project.

import { IRenderContext } from "../../models/i-render-context";
import { InheritableContext } from "../inheritable-context/inheritable-context";

export const globalStyleMap = new Map<string, HTMLStyleElement>();
export const renderContextMemoryMap = new Map<string, IRenderContext>();
export const inheritableContextMemoryMap = new Map<string | symbol, InheritableContext>();
