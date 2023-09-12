import { createElement as createElementHandler } from './create-element';
import { createFragment as createFragmentHandler } from './create-fragment';

export const createElement = createElementHandler;
export const createFragment = createFragmentHandler;

export const jsx = {
  createElement: createElementHandler,
  createFragment: createFragmentHandler,
};
