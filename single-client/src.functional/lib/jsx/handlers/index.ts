import { createElement as createElementHandler } from './create-element';
import { createFragment as createFragmentHandler } from './create-fragment';

export const createElement = createElementHandler;
export const createFragment = createFragmentHandler;

export const WC = {
    createElement: createElementHandler,
    createFragment: createFragmentHandler,
};
