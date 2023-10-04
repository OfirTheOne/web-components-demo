import { ComponentKeyBuilder as ComponentKey } from '@/common/component-key-builder';
import { VirtualElement } from '@/models';
import { signalRender } from './signal-render';
import { DOM } from '@sig/dom';

export function render(elem: JSX.Element | VirtualElement, id: string) {
  if (window.document.readyState === 'complete') {
    renderRoot(elem, id);
  } else {
    window.onload = () => {
      renderRoot(elem, id);
    };
  }
}

function renderRoot(elem: JSX.Element | VirtualElement, id: string) {
  const vElem = elem as VirtualElement;
  const element = signalRender(null, vElem, ComponentKey.build().root().toString());
  Array.isArray(element)
    ? element.forEach((node) => DOM.treeManipulation.appendToParent(DOM.access.getElementById(id), node))
    : DOM.treeManipulation.appendToParent(DOM.access.getElementById(id), element);
}
