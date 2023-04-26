import { Props } from "../../../models/props";
import { RenderUtils } from "../../utils/render-utils";

export function primitiveElementRenderer(tag: string, props: Props) {
    const element = document.createElement(tag);
    if (props) {
      const nonEmptyProps = props;
      const styleProp = <Record<string, unknown>>nonEmptyProps['style'];
      const refProp = <(e: HTMLElement) => void>nonEmptyProps['ref'];
      const propsEntries = Object.entries(nonEmptyProps).filter(([propKey]) => !['style', 'ref'].includes(propKey));
      const mutatedPropsEntries = RenderUtils.handleAttributeMutation(propsEntries);
      if (styleProp && typeof styleProp == 'object') {
        element.setAttribute('style', RenderUtils.convertStyleObjectToInlineStyle(styleProp));
      }
      if (refProp && typeof refProp === 'function') {
        refProp(element);
      }
      RenderUtils.appendDomProps(element, mutatedPropsEntries);
    }
    return element;
  }