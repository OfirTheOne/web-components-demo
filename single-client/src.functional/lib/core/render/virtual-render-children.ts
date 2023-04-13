import { ComponentKeyBuilder as ComponentKey } from './../component-key-builder';
import { VirtualElement, DomCompatibleElement } from '../../models';
import { RenderUtils } from './../utils/render-utils';
import { VirtualRender } from '../types';

export function virtualRenderChildren(
    virtualRender: VirtualRender,
    parent: HTMLElement,
    children: (string | VirtualElement)[],
    key: string
): DomCompatibleElement[] {
    if (children.length > 0) {
        return children
            .map((child, i) => {
                if (child === undefined || child === null) {
                    return child as null;
                } else if (typeof child !== 'string') {
                    return virtualRender(parent, child, ComponentKey.build(key).idx(i).toString());
                } else {
                    return RenderUtils.renderText(child);
                }
            })
            .flat();
    } else {
        return [];
    }
}
