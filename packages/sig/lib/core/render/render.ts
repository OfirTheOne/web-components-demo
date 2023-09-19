import { ComponentKeyBuilder as ComponentKey } from '@/common/component-key-builder';
import { VirtualElement } from '@/models';
import { signalRender } from './signal-render';

export function render(elem: JSX.Element | VirtualElement, id: string) {
  const vElem = elem as VirtualElement;
  const element = signalRender(null, vElem, ComponentKey.build().root().toString());
  Array.isArray(element)
    ? element.forEach((node) => document.getElementById(id).appendChild(node))
    : document.getElementById(id).appendChild(element);
}
