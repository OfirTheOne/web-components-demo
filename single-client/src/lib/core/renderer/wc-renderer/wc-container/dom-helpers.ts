

export class DOMHelpers {
  static removeSelf(elm?: HTMLElement | HTMLElement[]) {
    if (elm) {
      Array.isArray(elm) ? elm.forEach((node) => node.remove()) : elm.remove();
    }
  }

  static buildShadow(elm: HTMLElement) {
    return elm.attachShadow({ mode: "open" });
  }

  static appendToShadow(shadow: ShadowRoot, elem: HTMLElement | HTMLElement[]): void {
    Array.isArray(elem)
      ? elem.forEach((node) => shadow.appendChild(node))
      : shadow.appendChild(elem);
  }
}
