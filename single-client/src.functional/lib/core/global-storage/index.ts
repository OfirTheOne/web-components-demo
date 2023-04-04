
// This file is used to store global data storage that are used in the entire project.

import { RenderContext } from "../../models/render-context";

export const globalStyleMap = new Map<string, HTMLStyleElement>();
export const renderContextMemoryMap = new Map<string, RenderContext>();
