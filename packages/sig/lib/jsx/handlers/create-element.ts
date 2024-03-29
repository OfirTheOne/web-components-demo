import { FRAGMENT_FACTORY_NAME } from '@/constants';
import { Props, VirtualElement, VirtualElementType } from '@/models';

export const createElement = (
  tag: VirtualElement['tag'],
  props: Props,
  ...children: Array<VirtualElement | string>
): VirtualElement => {
  const flatChildren = children.flat();
  const nonEmptyChildren = flatChildren.map((c) => (typeof c === 'string' && c.trim().length === 0 ? null : c));

  let elementType: VirtualElementType;
  if (typeof tag === 'function') {
    if (tag.name === FRAGMENT_FACTORY_NAME) {
      elementType = VirtualElementType.Fragment;
    } else if(tag['$$type'] && tag['$$type'] === Symbol.for(VirtualElementType.MemoFunction)) {
      elementType = VirtualElementType.MemoFunction;
    } else if(tag['$$type'] && tag['$$type'] === Symbol.for(VirtualElementType.SignaledFunction)) {
      elementType = VirtualElementType.SignaledFunction;
    } else {
      elementType = VirtualElementType.Function;
    }
  } else if (typeof tag === 'string') {
    elementType = VirtualElementType.Basic;
  } else {
    elementType = VirtualElementType.Unknown;
  }

  return {
    $$type: Symbol.for(elementType),
    tag,
    props,
    children: nonEmptyChildren,
  };
};
