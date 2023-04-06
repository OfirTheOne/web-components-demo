
// This file is used to store global data storage that are used in the entire project.

import { IRenderContext } from "../../models/i-render-context";

export const globalStyleMap = new Map<string, HTMLStyleElement>();
export const renderContextMemoryMap = new Map<string, IRenderContext>();
